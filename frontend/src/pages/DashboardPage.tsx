import { useGetStatsOverviewQuery, useGetStatsByPriorityQuery, useGetStatsByAssigneeQuery } from '../store/statsApi';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import type { IssueStatus, Priority } from '../types';

export default function DashboardPage() {
  const { data: overviewResponse, isLoading: loadingOverview, error: errorOverview } = useGetStatsOverviewQuery();
  const { data: byPriorityResponse, isLoading: loadingPriority, error: errorPriority } = useGetStatsByPriorityQuery();
  const { data: byAssigneeResponse, isLoading: loadingAssignee, error: errorAssignee } = useGetStatsByAssigneeQuery();

  const overview = overviewResponse?.data;
  const byPriority = byPriorityResponse?.data;
  const byAssignee = byAssigneeResponse?.data;

  const isLoading = loadingOverview || loadingPriority || loadingAssignee;
  const error = errorOverview || errorPriority || errorAssignee;

  if (isLoading) {
    return <p>Loading dashboard…</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Failed to load dashboard data.</p>;
  }

  const total = overview ? Object.values(overview).reduce((sum, n) => sum + n, 0) : 0;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <span style={{ fontSize: 14, color: '#555' }}>Total issues: <strong>{total}</strong></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
        {overview && (
          <div style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 8 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#555' }}>이슈 현황</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const).map((status: IssueStatus) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <StatusBadge status={status} />
                  <span style={{ fontSize: 20, fontWeight: 700 }}>{overview[status]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {byPriority && (
          <div style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 8 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#555' }}>우선순위별</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((priority: Priority) => (
                <div key={priority} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <PriorityBadge priority={priority} />
                  <span style={{ fontSize: 20, fontWeight: 700 }}>{byPriority[priority]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {byAssignee && (
          <div style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 8 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#555' }}>담당자별</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(byAssignee).map(([name, count]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: '#333' }}>{name}</span>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
