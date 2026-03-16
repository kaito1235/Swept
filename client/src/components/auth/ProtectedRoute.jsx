import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FullPageSpinner } from '../ui/Spinner';

export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, appUser, hasRole, loading } = useAuth();

  if (loading) return <FullPageSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole) {
    return <Navigate to="/select-role" replace />;
  }

  if (requiredRole && appUser?.role !== requiredRole) {
    const dashboardPath = appUser?.role === 'host' ? '/dashboard/host' : '/dashboard/cleaner';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const { isAuthenticated, appUser, hasRole, loading } = useAuth();

  if (loading) return <FullPageSpinner />;

  if (isAuthenticated) {
    if (!hasRole) return <Navigate to="/select-role" replace />;
    const dashboardPath = appUser?.role === 'host' ? '/dashboard/host' : '/dashboard/cleaner';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
}
