import { baseApi } from './api';
import type { ApiResponse, Issue, Priority, IssueStatus } from '../types';

export const issuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query<ApiResponse<Issue[]>, void>({
      query: () => '/issues',
      providesTags: ['Issue'],
    }),
    getIssueById: builder.query<ApiResponse<Issue>, number>({
      query: (id) => `/issues/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Issue', id }],
    }),
    createIssue: builder.mutation<
      ApiResponse<Issue>,
      { title: string; description?: string; priority?: Priority }
    >({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Issue'],
    }),
    updateIssue: builder.mutation<
      ApiResponse<Issue>,
      { id: number; body: Partial<Pick<Issue, 'title' | 'description' | 'status' | 'priority'>> }
    >({
      query: ({ id, body }) => ({
        url: `/issues/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Issue'],
    }),
    updateIssueStatus: builder.mutation<
      ApiResponse<Issue>,
      { id: number; status: IssueStatus }
    >({
      query: ({ id, status }) => ({
        url: `/issues/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Issue'],
    }),
    deleteIssue: builder.mutation<void, number>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Issue'],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetIssueByIdQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useUpdateIssueStatusMutation,
  useDeleteIssueMutation,
} = issuesApi;
