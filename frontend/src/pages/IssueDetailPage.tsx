import { useState, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useGetIssueByIdQuery, useUpdateIssueMutation, useUpdateIssueStatusMutation, useDeleteIssueMutation } from '../store/issuesApi';
import { useCreateCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } from '../store/commentsApi';
import type { IssueStatus, Priority } from '../types';

const statusColors: Record<IssueStatus, string> = {
  BACKLOG: '#888',
  TODO: '#2563eb',
  IN_PROGRESS: '#ea580c',
  IN_REVIEW: '#7c3aed',
  DONE: '#16a34a',
};

const priorityColors: Record<Priority, string> = {
  LOW: '#888',
  MEDIUM: '#2563eb',
  HIGH: '#ea580c',
  URGENT: '#dc2626',
};

const allStatuses: IssueStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
const allPriorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

function Badge({ label, color }: { label: string; color: string }) {
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const issueId = Number(id);
  const { data, isLoading, error } = useGetIssueByIdQuery(issueId);
  const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();
  const [updateIssueStatus, { isLoading: isStatusUpdating }] = useUpdateIssueStatusMutation();
  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();

  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [editing, setEditing] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<IssueStatus>('BACKLOG');
  const [statusError, setStatusError] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<IssueStatus>('BACKLOG');
  const [editPriority, setEditPriority] = useState<Priority>('MEDIUM');
  const [editError, setEditError] = useState('');

  const [commentContent, setCommentContent] = useState('');
  const [commentError, setCommentError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [editCommentError, setEditCommentError] = useState('');

  if (isLoading) {
    return <p>Loading issue…</p>;
  }

  if (error || !data) {
    return <p style={{ color: 'red' }}>Failed to load issue.</p>;
  }

  const issue = data.data;
  const isCreator = user?.id === issue.creatorId;

  const handleStatusChange = async (newStatusValue: IssueStatus) => {
    if (!issue) return;
    setStatusError('');
    try {
      await updateIssueStatus({ id: issue.id, status: newStatusValue }).unwrap();
      setChangingStatus(false);
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data: { error?: string; info?: { allowedTransitions?: string[] } } }).data.error
          : undefined;
      setStatusError(msg ?? 'Status change failed.');
    }
  };

  const startStatusChange = () => {
    if (issue) {
      setNewStatus(issue.status);
    }
    setChangingStatus(true);
    setStatusError('');
  };

  const startEditing = () => {
    setEditTitle(issue.title);
    setEditDescription(issue.description ?? '');
    setEditStatus(issue.status);
    setEditPriority(issue.priority);
    setEditError('');
    setEditing(true);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setEditError('');
    try {
      await updateIssue({
        id: issue.id,
        body: {
          title: editTitle,
          description: editDescription || null,
          status: editStatus,
          priority: editPriority,
        },
      }).unwrap();
      setEditing(false);
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data: { error?: string; info?: { allowedTransitions?: string[] } } }).data.error
          : undefined;
      setEditError(msg ?? 'Update failed.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      await deleteIssue(issue.id).unwrap();
      navigate('/issues');
    } catch {
      alert('Failed to delete issue.');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <Link to="/issues" style={{ color: '#555', textDecoration: 'none', fontSize: 14 }}>
        ← Back to Issues
      </Link>

      {editing ? (
        <form onSubmit={handleUpdate} style={{ marginTop: 16 }}>
          <h2 style={{ margin: '0 0 16px' }}>Edit Issue</h2>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="edit-title" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="edit-desc" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Description
            </label>
            <textarea
              id="edit-desc"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={5}
              style={{ width: '100%', padding: 8, boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="edit-status" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                Status
              </label>
              <select
                id="edit-status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as IssueStatus)}
                style={{ width: '100%', padding: 8 }}
              >
                {allStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="edit-priority" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                Priority
              </label>
              <select
                id="edit-priority"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
                style={{ width: '100%', padding: 8 }}
              >
                {allPriorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          {editError && <p style={{ color: 'red', margin: '0 0 12px' }}>{editError}</p>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={isUpdating} style={{ padding: '8px 16px' }}>
              {isUpdating ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(false)} style={{ padding: '8px 16px' }}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ margin: '0 0 8px' }}>{issue.title}</h1>
            {isCreator && (
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={startEditing} style={{ padding: '6px 12px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{ padding: '6px 12px', cursor: 'pointer', color: '#dc2626', borderColor: '#dc2626' }}
                >
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
            <Badge label={issue.status} color={statusColors[issue.status]} />
            <Badge label={issue.priority} color={priorityColors[issue.priority]} />
            {isCreator && !changingStatus && (
              <button
                onClick={startStatusChange}
                style={{
                  padding: '4px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  backgroundColor: '#fff',
                }}
              >
                Change Status
              </button>
            )}
          </div>

          {changingStatus && (
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <p style={{ margin: '0 0 8px', fontWeight: 500 }}>Change Status</p>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                style={{ marginRight: 8, padding: 4 }}
              >
                {allStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={() => handleStatusChange(newStatus)}
                disabled={isStatusUpdating || newStatus === issue.status}
                style={{ marginRight: 4, padding: '4px 10px', cursor: 'pointer' }}
              >
                {isStatusUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setChangingStatus(false)}
                style={{ padding: '4px 10px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              {statusError && (
                <p style={{ color: '#dc2626', fontSize: 13, marginTop: 8, marginBottom: 0 }}>
                  {statusError}
                </p>
              )}
            </div>
          )}

          <div style={{ marginBottom: 16, lineHeight: 1.6, color: '#333' }}>
            {issue.description ?? <span style={{ color: '#aaa', fontStyle: 'italic' }}>No description.</span>}
          </div>

          <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
            Created by <strong>{issue.creator?.name ?? '—'}</strong> on {formatDate(issue.createdAt)}
          </div>

          <div>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
              Comments ({issue.comments?.length ?? 0})
            </h3>
            {(!issue.comments || issue.comments.length === 0) ? (
              <p style={{ color: '#888', fontSize: 14 }}>No comments yet.</p>
            ) : (
              issue.comments.map((comment) => (
                <div key={comment.id} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        rows={3}
                        style={{ width: '100%', padding: 8, boxSizing: 'border-box' as const, resize: 'vertical' }}
                      />
                      {editCommentError && (
                        <p style={{ color: 'red', margin: '4px 0', fontSize: 13 }}>{editCommentError}</p>
                      )}
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button
                          onClick={async () => {
                            setEditCommentError('');
                            try {
                              await updateComment({ commentId: comment.id, content: editCommentContent }).unwrap();
                              setEditingCommentId(null);
                              setEditCommentContent('');
                            } catch (err) {
                              const msg =
                                err && typeof err === 'object' && 'data' in err
                                  ? (err as { data: { error?: string } }).data.error
                                  : undefined;
                              setEditCommentError(msg ?? 'Failed to update comment.');
                            }
                          }}
                          disabled={isUpdatingComment || editCommentContent.trim().length < 1}
                          style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 4 }}
                        >
                          {isUpdatingComment ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditCommentContent('');
                            setEditCommentError('');
                          }}
                          style={{ padding: '6px 12px', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ fontSize: 13, color: '#888' }}>
                          <strong>{comment.author?.name ?? 'Unknown'}</strong> · {formatDate(comment.createdAt)}
                        </div>
                        {user?.id === comment.authorId && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditCommentContent(comment.content);
                                setEditCommentError('');
                              }}
                              style={{ padding: '4px 10px', fontSize: 12, cursor: 'pointer', border: '1px solid #ccc', borderRadius: 4, backgroundColor: '#fff' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm('Are you sure you want to delete this comment?')) return;
                                try {
                                  await deleteComment(comment.id).unwrap();
                                } catch {
                                  alert('Failed to delete comment.');
                                }
                              }}
                              style={{ padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: '#dc2626', border: '1px solid #dc2626', borderRadius: 4, backgroundColor: '#fff' }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: '#333' }}>{comment.content}</div>
                    </div>
                  )}
                </div>
              ))
            )}

            {user && (
              <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                <p style={{ margin: '0 0 8px', fontWeight: 500 }}>Add Comment</p>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  style={{ width: '100%', padding: 8, boxSizing: 'border-box' as const, resize: 'vertical' }}
                />
                {commentError && (
                  <p style={{ color: 'red', margin: '4px 0', fontSize: 13 }}>{commentError}</p>
                )}
                <button
                  onClick={async () => {
                    setCommentError('');
                    try {
                      await createComment({ issueId: issue.id, content: commentContent }).unwrap();
                      setCommentContent('');
                    } catch (err) {
                      const msg =
                        err && typeof err === 'object' && 'data' in err
                          ? (err as { data: { error?: string } }).data.error
                          : undefined;
                      setCommentError(msg ?? 'Failed to add comment.');
                    }
                  }}
                  disabled={isCreatingComment || commentContent.trim().length < 1}
                  style={{ marginTop: 8, padding: '6px 12px', cursor: 'pointer', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: 4 }}
                >
                  {isCreatingComment ? 'Adding...' : 'Add Comment'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
