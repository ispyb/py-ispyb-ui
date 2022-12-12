import { ProgressBar } from 'react-bootstrap';

import { useShowLoading } from 'hooks/useShowLoading';

export default function LoadingProgress() {
  const pending = useShowLoading();

  return (
    <div className="bg-primary loading-progress sticky-top">
      {pending && (
        <ProgressBar
          animated
          now={100}
          className="rounded-0"
          style={{ height: 5 }}
        />
      )}
      {!pending && (
        <ProgressBar
          className="rounded-0 bg-primary"
          style={{ height: 5, top: 59 }}
        />
      )}
    </div>
  );
}
