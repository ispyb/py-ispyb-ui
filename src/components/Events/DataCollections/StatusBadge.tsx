import { Badge } from 'react-bootstrap';

interface Props {
  status?: string;
}

function StatusBadge(props: Props) {
  const { status: rawStatus = null } = props;

  if (rawStatus === null) {
    return <Badge bg="info">Running</Badge>;
  }

  const status = rawStatus.toLowerCase();

  if (status.includes('success')) {
    return <Badge bg="success">Finished</Badge>;
  }

  if (status.includes('aborted')) {
    return <Badge bg="warning">Aborted</Badge>;
  }

  return <Badge bg="danger">Failed</Badge>;
}

export default StatusBadge;
