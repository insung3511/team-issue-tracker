import { baseApi } from './api';
import type { ApiResponse, Comment } from '../types';

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation<
      ApiResponse<Comment>,
      { issueId: number; content: string }
    >({
      query: ({ issueId, content }) => ({
        url: `/issues/${issueId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { issueId }) => [
        'Comment',
        { type: 'Issue', id: issueId },
      ],
    }),
    updateComment: builder.mutation<
      ApiResponse<Comment>,
      { commentId: number; content: string }
    >({
      query: ({ commentId, content }) => ({
        url: `/comments/${commentId}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: ['Comment', 'Issue'],
    }),
    deleteComment: builder.mutation<void, number>({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment', 'Issue'],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
