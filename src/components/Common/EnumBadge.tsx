import { Badge } from 'react-bootstrap';

export default function EnumBadge({
  value,
  colorEnum,
}: {
  value: any;
  colorEnum: Record<any, string>;
}) {
  if (!(value in colorEnum)) return null;
  return <Badge bg={colorEnum[value]}>{value}</Badge>;
}
