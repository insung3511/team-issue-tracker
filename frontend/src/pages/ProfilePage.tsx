import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useUpdateProfileMutation } from '../store/authApi';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: { name?: string; email?: string; password?: string; avatar?: string } = {};
    if (name !== user?.name) updateData.name = name;
    if (email !== user?.email) updateData.email = email;
    if (password) updateData.password = password;
    if (avatar !== user?.avatar) updateData.avatar = avatar;

    if (Object.keys(updateData).length === 0) {
      setMessage('No changes to save');
      return;
    }

    try {
      await updateProfile(updateData).unwrap();
      setMessage('Profile updated successfully!');
      setPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      setMessage(err?.data?.message || 'Failed to update profile');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Profile</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#6366f1',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 600,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{user.name}</div>
          <div style={{ color: '#666', fontSize: 14 }}>{user.email}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            Role: {user.role}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 14,
              border: '1px solid #ddd',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 14,
              border: '1px solid #ddd',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
            New Password <span style={{ fontWeight: 400, color: '#888' }}>(leave blank to keep current)</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 14,
              border: '1px solid #ddd',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
            Avatar URL
          </label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 14,
              border: '1px solid #ddd',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px',
            fontSize: 14,
            fontWeight: 500,
            color: '#fff',
            backgroundColor: isLoading ? '#9ca3af' : '#6366f1',
            border: 'none',
            borderRadius: 6,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>

        {message && (
          <div
            style={{
              padding: '12px',
              borderRadius: 6,
              backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2',
              color: message.includes('success') ? '#065f46' : '#991b1b',
              fontSize: 14,
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}