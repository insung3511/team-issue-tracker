import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link to="/dashboard" style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: '#111' }}>
            Team Issue Tracker
          </Link>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#555' }}>
            Dashboard
          </Link>
          <Link to="/issues" style={{ textDecoration: 'none', color: '#555' }}>
            Issues
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user && <span style={{ color: '#555', fontSize: 14 }}>{user.name}</span>}
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: 4,
              background: '#fff',
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      <main style={{ padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  );
}
