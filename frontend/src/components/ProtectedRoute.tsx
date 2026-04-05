import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { useGetMeQuery } from '../store/authApi';
import { setCredentials, logout } from '../store/authSlice';

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);
  const { data, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token || !!user,
  });

  useEffect(() => {
    if (data && token) {
      dispatch(setCredentials({ user: data.data, token }));
    }
    if (error) {
      dispatch(logout());
    }
  }, [data, error, token, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || (token && !user)) {
    return <p>Loading…</p>;
  }

  return <Outlet />;
}
