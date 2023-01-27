import { Badge } from 'react-bootstrap';

export default function SubSampleType({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const types: Record<string, string[]> = {
    poi: ['POI', 'info'],
    roi: ['ROI', 'primary'],
    loi: ['LOI', 'secondary'],
  };

  return (
    <Badge className={className} bg={types[type][1]}>
      {types[type][0]}
    </Badge>
  );
}
