import { ToastContainer, Toast } from 'react-bootstrap';
import './notificationtoast.scss';

export default function NotificationToast({
  type,
  message,
  onClose,
}: {
  type: string;
  message: string;
  onClose: () => void;
}) {
  return (
    <ToastContainer
      className="p-3"
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        zIndex: Number.MAX_SAFE_INTEGER,
      }}
    >
      <Toast onClose={onClose}>
        <Toast.Header className={`notif${type.toLowerCase()}-header`}>
          <strong className="me-auto">{type}</strong>
        </Toast.Header>
        <Toast.Body className={`notif${type.toLowerCase()}-body`}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
