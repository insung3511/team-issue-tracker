import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import IssuesListPage from './pages/IssuesListPage';
import CreateIssuePage from './pages/CreateIssuePage';
import IssueDetailPage from './pages/IssueDetailPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/issues" element={<IssuesListPage />} />
          <Route path="/issues/new" element={<CreateIssuePage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
