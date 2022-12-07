import { NetworkError, NetworkErrorBoundary, useController } from 'rest-hooks';
import { useAuth } from 'hooks/useAuth';

function AuthError({ error }: { error: NetworkError }) {
  const { clearToken } = useAuth();
  const { resetEntireStore } = useController();

  if (error.status === 401) {
    clearToken();
    resetEntireStore();
  }
  return <span>An error occured: {error.message}</span>;
}

export default function AuthErrorBoundary({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <NetworkErrorBoundary fallbackComponent={AuthError}>
      {children}
    </NetworkErrorBoundary>
  );
}
