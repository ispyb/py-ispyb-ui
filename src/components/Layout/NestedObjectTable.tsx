import Table, { IColumn } from './Table';

export default function NestedObjectTable({ object }: { object: any }) {
  if (!object) return <span>No Parameters</span>;
  if (typeof object === 'object') {
    const columns = [
      { key: 'key', label: 'Key' },
      {
        key: 'value',
        label: 'Value',
        formatter: (row: any, column: IColumn) => (
          <NestedObjectTable object={row[column.key]} />
        ),
      },
    ];

    const args = Object.entries(object).map(([key, value]: [string, any]) => ({
      key,
      value,
    }));

    return (
      <Table
        keyId="key"
        results={args}
        columns={columns}
        emptyText="No Parameters"
      />
    );
  }
  return <span>{object}</span>;
}
