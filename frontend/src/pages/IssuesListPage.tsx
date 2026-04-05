import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetIssuesQuery } from '../store/issuesApi';
import { StatusBadge, PriorityBadge } from '../components/Badge';
import type { IssueStatus, Priority } from '../types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

const ITEMS_PER_PAGE = 10;

export default function IssuesListPage() {
  const [statusFilter, setStatusFilter] = useState<IssueStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetIssuesQuery({
    ...(statusFilter && { status: statusFilter }),
    ...(priorityFilter && { priority: priorityFilter }),
    page,
    limit: ITEMS_PER_PAGE,
  });

  if (isLoading) {
    return <p>Loading issues…</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Failed to load issues.</p>;
  }

  const issues = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Issues</h1>
        <Link
          to="/issues/new"
          style={{
            padding: '8px 16px',
            backgroundColor: '#111',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          Create Issue
        </Link>
      </div>

      {/* Filter Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as IssueStatus | '');
            setPage(1);
          }}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="">All Statuses</option>
          <option value="BACKLOG">BACKLOG</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="IN_REVIEW">IN_REVIEW</option>
          <option value="DONE">DONE</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value as Priority | '');
            setPage(1);
          }}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="">All Priorities</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
      </div>

      {issues.length === 0 ? (
        <p style={{ color: '#888' }}>No issues yet. Create one to get started.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px 4px' }}>Title</th>
              <th style={{ padding: '8px 4px' }}>Status</th>
              <th style={{ padding: '8px 4px' }}>Priority</th>
              <th style={{ padding: '8px 4px' }}>Creator</th>
              <th style={{ padding: '8px 4px' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px 4px' }}>
                  <Link to={`/issues/${issue.id}`} style={{ color: '#111', textDecoration: 'none', fontWeight: 500 }}>
                    {issue.title}
                  </Link>
                </td>
                <td style={{ padding: '8px 4px' }}>
                  <StatusBadge status={issue.status} />
                </td>
                <td style={{ padding: '8px 4px' }}>
                  <PriorityBadge priority={issue.priority} />
                </td>
                <td style={{ padding: '8px 4px', color: '#555', fontSize: 14 }}>
                  {issue.creator?.name ?? '—'}
                </td>
                <td style={{ padding: '8px 4px', color: '#555', fontSize: 14 }}>
                  {formatDate(issue.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {pagination && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            marginTop: 16,
            padding: '12px 0',
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              opacity: page <= 1 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>
          <span style={{ color: '#555', fontSize: 14 }}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pagination.totalPages}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer',
              opacity: page >= pagination.totalPages ? 0.5 : 1,
            }}
          >
            Next →
          </button>
          <span style={{ color: '#888', fontSize: 13 }}>
            {pagination.total} issues total
          </span>
        </div>
      )}
    </div>
  );
}
