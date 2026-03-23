import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../store/authApi';
import { setCredentials } from '../store/authSlice';
import { useDispatch } from 'react-redux';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate('/');
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data: { message?: string } }).data.message
          : undefined;
      setError(msg ?? 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 16px' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 4 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 4 }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        {error && <p style={{ color: 'red', margin: '0 0 12px' }}>{error}</p>}
        <button type="submit" disabled={isLoading} style={{ padding: '8px 16px' }}>
          {isLoading ? 'Logging in…' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: 16 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
