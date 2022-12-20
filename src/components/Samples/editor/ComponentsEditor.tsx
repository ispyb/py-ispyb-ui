import {
  faEdit,
  faPlus,
  faRemove,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentResource } from 'api/resources/Sample';
import Table from 'components/Layout/Table';
import { usePaging } from 'hooks/usePaging';
import { usePath } from 'hooks/usePath';
import { Component } from 'models/Component';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useSuspense } from 'rest-hooks';

export default function ComponentsEditor() {
  const proposal = usePath('proposal');
  const { skip, limit } = usePaging(10, 0, 'components');

  const components = useSuspense(ComponentResource.list(), {
    skip,
    limit,
    ...(proposal ? { proposal } : {}),
  });

  const editComponent = (row: Component) => {
    return (
      <Button size="sm" className="text-nowrap">
        <FontAwesomeIcon icon={faEdit} /> Edit
      </Button>
    );
  };

  const removeComponent = (row: Component) => {
    return (
      <Button size="sm" className="text-nowrap" variant="danger">
        <FontAwesomeIcon icon={faTrash} /> Remove
      </Button>
    );
  };

  return (
    <>
      <Row>
        <Col>
          <Button size="sm">
            <FontAwesomeIcon icon={faPlus} /> Create new
          </Button>
        </Col>
      </Row>
      <Table
        columns={[
          { label: 'Name', key: 'name' },
          { label: 'Type', key: 'ComponentType.name' },
          {
            label: '',
            key: 'edit',
            formatter: editComponent,
            headerStyle: { width: 0 },
          },
          {
            label: '',
            key: 'remove',
            formatter: removeComponent,
            headerStyle: { width: 0 },
          },
        ]}
        results={components.results}
        keyId={'componentId'}
        paginator={{
          total: components.total,
          skip: components.skip,
          limit: components.limit,
          suffix: 'components',
        }}
      />
    </>
  );
}
