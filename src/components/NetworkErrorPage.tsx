import { NetworkErrorBoundary } from 'rest-hooks';
import { ParsedError } from 'components/ParsedError';

export default function NetworkErrorPage({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <NetworkErrorBoundary fallbackComponent={ParsedError}>
      {children}
    </NetworkErrorBoundary>
  );
}
