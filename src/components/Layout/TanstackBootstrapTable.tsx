import type { Table, RowData, Column } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { CSSProperties } from 'react';
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  FormSelect,
  Row,
  Table as BootstrapTable,
} from 'react-bootstrap';

export function TanstackBootstrapTable<TData extends RowData>({
  table,
  pagination = true,
  onRowClick,
  rowStyle = () => ({}),
}: {
  table: Table<TData>;
  pagination?: boolean;
  onRowClick?: (row: TData) => void;
  rowStyle?: (v: TData) => CSSProperties;
}) {
  const paginationElement = (
    <Row>
      <Col xs="auto">
        <ButtonGroup>
          <Button
            variant={table.getCanPreviousPage() ? 'secondary' : 'light'}
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </Button>
          <Button
            variant={table.getCanPreviousPage() ? 'secondary' : 'light'}
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </Button>
          <Button
            variant={table.getCanNextPage() ? 'secondary' : 'light'}
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </Button>
          <Button
            variant={table.getCanNextPage() ? 'secondary' : 'light'}
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </Button>
        </ButtonGroup>
      </Col>

      <Col xs="auto" style={{ display: 'flex', alignItems: 'center' }}>
        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
      </Col>

      <Col xs="auto">
        <FormSelect
          size="sm"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </FormSelect>
      </Col>
    </Row>
  );
  return (
    <Col style={{ marginTop: '1rem' }}>
      {pagination && paginationElement}
      <Row
        style={{
          overflowX: 'auto',
        }}
      >
        <BootstrapTable striped hover size="sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
                style={{
                  cursor: onRowClick ? 'pointer' : undefined,
                  ...rowStyle(row.original),
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      verticalAlign: 'middle',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </BootstrapTable>
      </Row>
      {pagination && paginationElement}
    </Col>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <Form.Control
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder="Min"
      />
      <Form.Control
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder="Max"
      />
    </div>
  ) : (
    <Form.Control
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Search..."
    />
  );
}
