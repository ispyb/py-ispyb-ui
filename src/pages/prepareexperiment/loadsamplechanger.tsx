import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingPanel from 'components/loading/loadingpanel';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { Dewar } from 'pages/model';
import { MXContainer } from 'pages/mx/container/mxcontainer';
import { Suspense, useState } from 'react';
import { Alert, Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';

import './loadsamplechanger.scss';
import SampleChanger from './samplechanger';

export const ItemTypes = {
  CONTAINER: 'container',
};

export default function LoadSampleChanger({
  dewars,
  proposalName,
  setContainerPosition,
}: {
  dewars?: Dewar[];
  proposalName: string;
  setContainerPosition: (containerId: number, beamline: string, position: string) => void;
}) {
  // const [container, setContainer] = useState<Dewar | undefined>(undefined);
  return (
    <DndProvider backend={HTML5Backend}>
      <Card>
        <Card.Header>2. Load sample changer</Card.Header>
        {/* <Card.Body>{dewars ? <ContainerTable selected={container} dewars={dewars} setContainer={setContainer}></ContainerTable> : 'You must select a shipment first'}</Card.Body> */}
        {/* <Card.Body>
        {container ? (
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>
            <Row>
              <Col style={{ display: 'flex' }}>
                <Row style={{ margin: 'auto' }}>
                  <Col>
                    <Row>
                      <h5 style={{ textAlign: 'center' }}>Positioning container: </h5>
                    </Row>
                    <Row>
                      <div>
                        <MXContainer containerType={container.containerType} proposalName={proposalName} containerId={String(container.containerId)}></MXContainer>
                      </div>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col md={'auto'} style={{ width: 1, padding: 0, backgroundColor: 'gray' }}>
                <p style={{ position: 'relative', top: '49%', left: -30, width: 60, textAlign: 'center', background: 'white' }}>
                  <strong>to beamline</strong>
                </p>
              </Col>
              <Col>
                <Row>
                  <div style={{ width: 450, margin: 'auto' }}>
                    <SampleChanger proposalName={proposalName} beamline={container.beamlineLocation} containers={dewars}></SampleChanger>
                  </div>
                </Row>
              </Col>
            </Row>{' '}
          </Suspense>
        ) : (
          <Alert variant="info">You must select a container to load</Alert>
        )}
      </Card.Body> */}
        <Card.Body>
          <Row>
            {dewars?.map((d) => {
              return (
                <Col md={'auto'}>
                  <DragableContainer d={d} proposalName={proposalName}></DragableContainer>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
        <Card.Body>
          <Row>
            <div style={{ width: 450, margin: 'auto' }}>
              <SampleChanger setContainerPosition={setContainerPosition} proposalName={proposalName} beamline={'ID30A-1'} containers={dewars}></SampleChanger>
            </div>
          </Row>
        </Card.Body>
      </Card>
    </DndProvider>
  );
}

export function DragableContainer({ d, proposalName }: { d: Dewar; proposalName: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CONTAINER,
    item: d,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <div>
      <div
        ref={drag}
        style={{
          cursor: 'move',
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <MXContainer showInfo={false} containerType={d.containerType} proposalName={proposalName} containerId={String(d.containerId)}></MXContainer>
      </div>
      <SimpleParameterTable
        parameters={[
          { key: 'Shipment', value: d.shippingName },
          { key: 'Container', value: d.containerCode },
          { key: 'Type', value: d.containerType },
          { key: 'Beamline', value: d.beamlineLocation },
          { key: 'sampleChangerLocation', value: d.sampleChangerLocation },
        ]}
      ></SimpleParameterTable>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
export function ContainerTable({ dewars, setContainer, selected }: { dewars: Dewar[]; setContainer: (c: Dewar) => void; selected?: Dewar }) {
  const columns: ColumnDescription<Dewar>[] = [
    { text: 'id', dataField: 'containerId', hidden: true },
    {
      text: 'Shipment',
      dataField: 'shippingName',
      filter: textFilter({
        placeholder: 'Search...',
      }),
    },
    {
      text: 'Container',
      dataField: 'containerCode',
      filter: textFilter({
        placeholder: 'Search...',
      }),
    },
    {
      text: 'Type',
      dataField: 'containerType',
      filter: textFilter({
        placeholder: 'Search...',
      }),
    },
    {
      text: 'Beamline',
      dataField: 'beamlineLocation',
      filter: textFilter({
        placeholder: 'Search...',
      }),
    },
    {
      text: 'Cell',
      dataField: 'sampleChangerLocation',
      formatter: (cell) => {
        if (!cell || isNaN(Number(cell))) {
          return '';
        }
        return `${Math.floor(Number(cell) / 3) + 1}`;
      },
      hidden: false,
    },
    {
      text: 'Position',
      dataField: 'sampleChangerLocation',
      formatter: (cell) => {
        if (!cell || isNaN(Number(cell))) {
          return '';
        }
        return `${Number(cell) % 3}`;
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
  if (!['Spinepuck', 'Unipuck', 'Puck'].includes(container.containerType)) {
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
