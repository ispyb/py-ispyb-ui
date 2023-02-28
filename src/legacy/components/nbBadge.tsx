import { PropsWithChildren } from 'react';
import { Badge } from 'react-bootstrap';

export default function NbBadge({
  value,
  children,
}: PropsWithChildren<{ value?: number }>) {
  return <Badge bg={value ? 'info' : 'light'}>{value}</Badge>;
}
