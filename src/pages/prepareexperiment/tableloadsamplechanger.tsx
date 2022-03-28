import { containerCanGoInPosition, getContainerPosition } from 'helpers/mx/samplehelper';
import { range } from 'lodash';
import { Beamline } from 'models';
import { ContainerDewar } from 'pages/model';
import { useState } from 'react';
import { Alert, Button, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { findBestDefaultBeamline } from './dndloadsamplechanger';

export default function TableLoadSampleChanger({
  dewars,
  setContainerPosition,
  setContainerBeamline,
  beamlines,
}: {
  dewars?: ContainerDewar[];
  proposalName: string;
  // eslint-disable-next-line no-unused-vars
  setContainerPosition: (containerId: number, position: string) => void;
  // eslint-disable-next-line no-unused-vars
  setContainerBeamline: (containerId: number, beamline: string) => void;
  beamlines: Beamline[];
}) {
  // eslint-disable-next-line no-unused-vars

  if (dewars) {
    return <ContainerTable setContainerPosition={setContainerPosition} setContainerBeamline={setContainerBeamline} beamlines={beamlines} dewars={dewars}></ContainerTable>;
  }
  return <Alert variant="info">No container found in selected shipments</Alert>;
}

export function ContainerTable({
  dewars,
  beamlines,
  setContainerPosition,
  setContainerBeamline,
}: {
  dewars: ContainerDewar[];
  beamlines: Beamline[];
  // eslint-disable-next-line no-unused-vars
  setContainerPosition: (containerId: number, position: string) => void;
  // eslint-disable-next-line no-unused-vars
  setContainerBeamline: (containerId: number, beamline: string) => void;
}) {
  const [beamline, setBeamline] = useState(findBestDefaultBeamline(beamlines, dewars));

  const setBeamlineForAll = () => {
    for (const dewar of dewars) {
      if (dewar.beamlineLocation != beamline.name) {
        setContainerBeamline(dewar.containerId, beamline.name);
      }
    }
  };

  const getContainerBeamline = (c: ContainerDewar) => {
    for (const b of beamlines) {
      if (b.name == c.beamlineLocation) {
        return b;
      }
    }
    return undefined;
  };

  const columns: ColumnDescription<ContainerDewar>[] = [
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
      formatter: (cell, row) => {
        return (
          <BeamLineSelector
            beamline={getContainerBeamline(row)}
            beamlines={beamlines}
            setBeamline={(b) => {
              setContainerBeamline(row.containerId, b.name);
            }}
            size="sm"
            variant={'secondary'}
          ></BeamLineSelector>
        );
      },
      filter: textFilter({
        placeholder: 'Search...',
      }),
    },
    {
      text: 'Position',
      dataField: 'sampleChangerLocation',
      formatter: (cell, row) => {
        // const pos = getContainerPosition(cell);
        // if (!pos) {
        //   return '';
        // }
        // return `cell ${pos.cell} pos ${pos.position}`;
        return (
          <PositionSelector
            container={row}
            beamline={getContainerBeamline(row)}
            setPosition={(pos) => {
              setContainerPosition(row.containerId, pos);
            }}
          ></PositionSelector>
        );
      },
      hidden: false,
    },
  ];

  return (
    <Col style={{ margin: 15, marginTop: 0 }}>
      <Row style={{ marginBottom: 10 }}>
        <Col></Col>
        <Col md={'auto'} style={{ padding: 1 }}>
          <BeamLineSelector beamline={beamline} beamlines={beamlines} setBeamline={setBeamline}></BeamLineSelector>
        </Col>
        <Col md={'auto'} style={{ padding: 1 }}>
          <Button onClick={setBeamlineForAll}>Set for all</Button>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <BootstrapTable
          bootstrap4
          wrapperClasses="table-responsive"
          keyField="Id"
          data={dewars}
          columns={columns}
          condensed
          striped
          pagination={paginationFactory({ sizePerPage: 20, showTotal: true, hideSizePerPage: true, hidePageListOnlyOnePage: true })}
          filter={filterFactory()}
        />
      </Row>
    </Col>
  );
}

export function BeamLineSelector({
  beamline,
  beamlines,
  setBeamline,
  size,
  variant,
}: {
  beamline?: Beamline;
  beamlines: Beamline[];
  // eslint-disable-next-line no-unused-vars
  setBeamline: (b: Beamline) => void;
  size?: 'sm' | 'lg' | undefined;
  variant?: string | undefined;
}) {
  return (
    <DropdownButton variant={variant} size={size} title={beamline ? beamline.name : ''}>
      {beamlines.map((b) => {
        return (
          <Dropdown.Item
            onClick={() => {
              setBeamline(b);
            }}
            key={b.name}
          >
            {b.name}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
}

export function PositionSelector({
  beamline,
  container,
  setPosition,
  size,
  variant,
}: {
  beamline?: Beamline;
  container: ContainerDewar;
  // eslint-disable-next-line no-unused-vars
  setPosition: (pos: string) => void;
  size?: 'sm' | 'lg' | undefined;
  variant?: string | undefined;
}) {
  const posToStr = (p: string) => {
    const pos = getContainerPosition(p);
    if (!pos) {
      return 'none';
    }
    return `cell ${pos.cell} pos ${pos.position}`;
  };

  let anyChoice = false;

  const choices = range(1, 25).map((n) => {
    if (containerCanGoInPosition(beamline?.sampleChangerType, container.containerType, String(n))) {
      const pos = getContainerPosition(String(n));
      anyChoice = true;
      return (
        <>
          {pos?.position == 1 && <Dropdown.Header>{`Cell ${pos.cell}`}</Dropdown.Header>}
          <Dropdown.Item
            onClick={() => {
              setPosition(String(n));
            }}
            key={n}
          >
            {getContainerPosition(String(n))?.position}
          </Dropdown.Item>
        </>
      );
    }
    return undefined;
  });

  const config = {
    modifiers: [
      {
        name: 'computeStyles',
        options: {
          gpuAcceleration: false, // true by default
        },
      },
    ],
  };

  return (
    <DropdownButton variant={variant} size={size} title={posToStr(container.sampleChangerLocation)}>
      <Dropdown.Menu popperConfig={config}> {anyChoice ? choices : <Dropdown.Header>{`No compatible position`}</Dropdown.Header>}</Dropdown.Menu>
    </DropdownButton>
  );
}
