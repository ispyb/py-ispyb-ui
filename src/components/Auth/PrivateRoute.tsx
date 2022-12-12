import { Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import AuthErrorBoundary from 'components/AuthErrorBoundary';
import Login from './Login/Login';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <AuthErrorBoundary>
      <Outlet />
    </AuthErrorBoundary>
  );
};

export default PrivateRoute;
