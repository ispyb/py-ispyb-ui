import { MetadataCol } from 'components/Events/Metadata';

interface Parameter {
  key: string;
  value: string | number | JSX.Element | undefined | null;
  className?: string;
  units?: string;
  valueTooltip?: string;
}

interface Props {
  parameters: Parameter[];
  header?: string;
}

export default function SimpleParameterTable({
  parameters,
}: Props): JSX.Element {
  return (
    <MetadataCol
      properties={parameters.map((p) => {
        return {
          title: p.key,
          content: p.value,
          unit: p.units,
        };
      })}
    />
  );
}
