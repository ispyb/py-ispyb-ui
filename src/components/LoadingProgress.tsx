import { ProgressBar } from 'react-bootstrap';

import { useShowLoading } from 'hooks/useShowLoading';

export default function LoadingProgress() {
  const pending = useShowLoading();

  return (
    <div className="loading-progress">
      {pending && (
        <ProgressBar
          animated
          now={100}
          className="rounded-0"
          style={{ height: 5 }}
        />
      )}
      {!pending && <div style={{ height: 5 }} />}
    </div>
  );
}
