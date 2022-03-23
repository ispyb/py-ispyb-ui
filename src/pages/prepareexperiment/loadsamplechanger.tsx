import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingPanel from 'components/loading/loadingpanel';
import { Dewar } from 'pages/model';
import { MXContainer } from 'pages/mx/container/mxcontainer';
import { Suspense, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

import './loadsamplechanger.scss';
import SampleChanger from './samplechanger';

export default function LoadSampleChanger({ dewars, proposalName }: { dewars?: Dewar[]; proposalName: string }) {
  const [container, setContainer] = useState<Dewar | undefined>(undefined);
  return (
    <Card>
      <Card.Header>Load sample changer</Card.Header>
      <Card.Body>{dewars ? <ContainerTable selected={container} dewars={dewars} setContainer={setContainer}></ContainerTable> : 'You must select a shipment first'}</Card.Body>
      <Card.Body>
        {container ? (
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>
            <Row>
              <Col>
                <Row>
                  <h5 style={{ textAlign: 'center' }}>Placing sample: </h5>
                </Row>
                <Row>
                  <div style={{ maxWidth: 200, margin: 'auto' }}>
                    <MXContainer showInfo={false} containerType={container.containerType} proposalName={proposalName} containerId={String(container.containerId)}></MXContainer>
                  </div>
                </Row>
              </Col>
              <Col>
                <Row>
                  <div style={{ maxWidth: 400, margin: 'auto' }}>
                    <SampleChanger></SampleChanger>
                  </div>
                </Row>
              </Col>
            </Row>{' '}
          </Suspense>
        ) : (
          'You must select a shipment first'
        )}
      </Card.Body>
    </Card>
  );
}

// eslint-disable-next-line no-unused-vars
export function ContainerTable({ dewars, setContainer, selected }: { dewars: Dewar[]; setContainer: (c: Dewar) => void; selected?: Dewar }) {
  const columns: ColumnDescription<Dewar>[] = [
    { text: 'id', dataField: 'containerId', hidden: true },
    { text: 'Shipment', dataField: 'shippingName', hidden: false },
    { text: 'Container', dataField: 'containerCode', hidden: false },
    { text: 'Type', dataField: 'containerType', hidden: false },
    { text: 'Beamline', dataField: 'beamlineLocation', hidden: false },
    {
      text: 'Position',
      dataField: 'sampleChangerLocation',
      formatter: (cell) => {
        if (!cell) {
          return '';
        }
        if (isNaN(cell)) {
          return cell;
        }
        return `${Math.floor(cell / 3) + 1} - ${cell % 3}`;
      },
      hidden: false,
    },
    {
      text: '',
      dataField: 'shippingId',
      formatter: (cell, row) => {
        return <SelectContainer container={row} setContainer={setContainer}></SelectContainer>;
      },
      headerStyle: { width: 40 },
      style: { verticalAlign: 'middle', textAlign: 'center' },
    },
  ];

  return (
    <Col>
      <Row>
        <BootstrapTable
          bootstrap4
          wrapperClasses="table-responsive"
          keyField="Id"
          data={dewars}
          columns={columns}
          condensed
          striped
          rowClasses={(row: Dewar) => {
            return row.containerId == selected?.containerId ? 'selectedforplacement' : '';
          }}
          pagination={paginationFactory({ sizePerPage: 5, showTotal: true, hideSizePerPage: true, hidePageListOnlyOnePage: true })}
          filter={filterFactory()}
        />
      </Row>
    </Col>
  );
}

// eslint-disable-next-line no-unused-vars
export function SelectContainer({ container, setContainer }: { container: Dewar; setContainer: (c: Dewar) => void }) {
  if (!['Spinepuck', 'Unipuck'].includes(container.containerType)) {
    return <></>;
  }

  const onClick = () => {
    setContainer(container);
  };
  return (
    <OverlayTrigger placement="right" overlay={<Tooltip>Place container</Tooltip>}>
      <Button style={{ padding: 0 }} variant="link" onClick={onClick}>
        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
      </Button>
    </OverlayTrigger>
  );
}
