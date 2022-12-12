import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';

const JavaRoute = () => {
  const { site } = useAuth();

  if (!site.javaMode) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default JavaRoute;
