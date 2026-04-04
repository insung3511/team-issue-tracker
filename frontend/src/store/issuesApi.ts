import { baseApi } from './api';
import type { ApiResponse, PaginatedResponse, Issue, Priority, IssueStatus } from '../types';

export const issuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query<
      PaginatedResponse<Issue>,
      { status?: IssueStatus; priority?: Priority; page?: number; limit?: number } | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params && params.status) searchParams.set('status', params.status);
        if (params && params.priority) searchParams.set('priority', params.priority);
        if (params && params.page) searchParams.set('page', String(params.page));
        if (params && params.limit) searchParams.set('limit', String(params.limit));
        const qs = searchParams.toString();
        return `/issues${qs ? `?${qs}` : ''}`;
      },
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
