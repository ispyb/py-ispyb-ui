import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';

const PyRoute = () => {
  const { site } = useAuth();

  if (site.javaMode) {
    return <Navigate to="/legacy" />;
  }

  return <Outlet />;
};

export default PyRoute;
