import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateIssueMutation } from '../store/issuesApi';
import type { Priority } from '../types';

const allPriorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function CreateIssuePage() {
  const navigate = useNavigate();
  const [createIssue, { isLoading }] = useCreateIssueMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createIssue({
        title,
        description: description || undefined,
        priority,
      }).unwrap();
      navigate('/issues');
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data: { message?: string } }).data.message
          : undefined;
      setError(msg ?? 'Failed to create issue.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Link to="/issues" style={{ color: '#555', textDecoration: 'none', fontSize: 14 }}>
        ← Back to Issues
      </Link>
      <h1 style={{ marginTop: 16 }}>Create Issue</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: 8, boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="priority" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            style={{ width: '100%', padding: 8 }}
          >
            {allPriorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        {error && <p style={{ color: 'red', margin: '0 0 12px' }}>{error}</p>}
        <button type="submit" disabled={isLoading} style={{ padding: '8px 16px' }}>
          {isLoading ? 'Creating…' : 'Create Issue'}
        </button>
      </form>
    </div>
  );
}
