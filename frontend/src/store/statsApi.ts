import { baseApi } from './api';
import type { ApiResponse, StatsOverview, StatsByPriority, StatsByAssignee } from '../types';

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStatsOverview: builder.query<ApiResponse<StatsOverview>, void>({
      query: () => '/stats/overview',
      providesTags: ['Stats'],
    }),
    getStatsByPriority: builder.query<ApiResponse<StatsByPriority>, void>({
      query: () => '/stats/by-priority',
      providesTags: ['Stats'],
    }),
    getStatsByAssignee: builder.query<ApiResponse<StatsByAssignee>, void>({
      query: () => '/stats/by-assignee',
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useGetStatsOverviewQuery,
  useGetStatsByPriorityQuery,
  useGetStatsByAssigneeQuery,
} = statsApi;
