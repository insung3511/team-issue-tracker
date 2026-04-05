import type { IssueStatus, Priority } from '../types';

export const statusColors: Record<IssueStatus, string> = {
  BACKLOG: '#888',
  TODO: '#2563eb',
  IN_PROGRESS: '#ea580c',
  IN_REVIEW: '#7c3aed',
  DONE: '#16a34a',
};

export const priorityColors: Record<Priority, string> = {
  LOW: '#888',
  MEDIUM: '#2563eb',
  HIGH: '#ea580c',
  URGENT: '#dc2626',
};

export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        color: '#fff',
        backgroundColor: color,
      }}
    >
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: IssueStatus }) {
  return <Badge label={status} color={statusColors[status]} />;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge label={priority} color={priorityColors[priority]} />;
}
