import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Redirects to login if not authenticated.
 */
export const ProtectedRoute = () => {
  const { state } = useApp();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * Redirects to dashboard if already authenticated (for login/signup pages).
 */
export const PublicRoute = () => {
  const { state } = useApp();
  
  if (state.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
