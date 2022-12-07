import {
  containerCanGoInLocation,
  getSampleChanger,
} from 'legacy/helpers/mx/samplehelper';
import { range } from 'lodash';
import { Beamline } from 'legacy/models';
import { ContainerDewar } from 'legacy/pages/model';
import { useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { findBestDefaultBeamline } from './dndloadsamplechanger';
import Select from 'react-select';

import './tableloadsamplechanger.scss';

export default function TableLoadSampleChanger({
  dewars,
  setContainerLocation,
  beamlines,
}: {
  dewars?: ContainerDewar[];
  proposalName: string;
  // eslint-disable-next-line no-unused-vars
  setContainerLocation: (
    containerId: number,
    beamline: string | undefined,
    position: string | undefined
  ) => void;

  beamlines: Beamline[];
}) {
  // eslint-disable-next-line no-unused-vars

  if (dewars) {
    return (
      <ContainerTable
        setContainerLocation={setContainerLocation}
        beamlines={beamlines}
        dewars={dewars}
      ></ContainerTable>
    );
  }
  return <Alert variant="info">No container found in selected shipments</Alert>;
}

export function ContainerTable({
  dewars,
  beamlines,
  setContainerLocation,
}: {
  dewars: ContainerDewar[];
  beamlines: Beamline[];
  // eslint-disable-next-line no-unused-vars
  setContainerLocation: (
    containerId: number,
    beamline: string | undefined,
    position: string | undefined
  ) => void;
}) {
  const [beamline, setBeamline] = useState(
    findBestDefaultBeamline(beamlines, dewars)
  );

  const setBeamlineForAll = () => {
    for (const dewar of dewars) {
      if (dewar.beamlineLocation !== beamline.name) {
        setContainerLocation(dewar.containerId, beamline.name, undefined);
      }
    }
  };

  const getContainerBeamline = (c: ContainerDewar) => {
    for (const b of beamlines) {
      if (b.name === c.beamlineLocation) {
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
              setContainerLocation(row.containerId, b.name, undefined);
            }}
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
      headerStyle: { minWidth: 150 },
      formatter: (cell, row) => {
        return (
          <PositionSelector
            container={row}
            beamline={getContainerBeamline(row)}
            setPosition={(pos) => {
              setContainerLocation(row.containerId, row.beamlineLocation, pos);
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
          <BeamLineSelector
            beamline={beamline}
            beamlines={beamlines}
            setBeamline={setBeamline}
          ></BeamLineSelector>
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
          pagination={paginationFactory({
            sizePerPage: 20,
            showTotal: true,
            hideSizePerPage: true,
            hidePageListOnlyOnePage: true,
          })}
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
}: {
  beamline?: Beamline;
  beamlines: Beamline[];
  // eslint-disable-next-line no-unused-vars
  setBeamline: (b: Beamline) => void;
}) {
  const options = beamlines.map((b) => {
    return { label: b.name, value: b };
  });

  return (
    <Select
      value={{ label: beamline ? beamline.name : '', value: beamline }}
      onChange={(v) => {
        if (v && v.value) {
          setBeamline(v.value);
        }
      }}
      options={options}
    />
  );
}

export function PositionSelector({
  beamline,
  container,
  setPosition,
}: {
  beamline?: Beamline;
  container: ContainerDewar;
  // eslint-disable-next-line no-unused-vars
  setPosition: (pos: string) => void;
}) {
  const changer = getSampleChanger(beamline?.sampleChangerType);

  const posToStr = (p: string) => {
    const pos = changer?.getPosition(Number(p));
    if (!pos) {
      return 'none';
    }
    return `cell ${pos.cell + 1} pos ${pos.position + 1}`;
  };

  const options = range(0, changer?.getNbCell()).map((cell) => {
    const opts: {
      label: string;
      value: string;
    }[] = [];
    for (const pos of range(0, changer?.getNbContainerInCell(cell))) {
      const location = changer?.getLocation(cell, pos);

      if (
        containerCanGoInLocation(changer, container.containerType, location)
      ) {
        opts.push({ label: String(pos + 1), value: String(location) });
      }
    }
    return {
      label: `Cell ${cell + 1}`,
      options: opts,
    };
  });

  const value: ({ label: string; value: string } | undefined)[] = [
    {
      label: posToStr(container.sampleChangerLocation),
      value: container.sampleChangerLocation,
    },
  ];
  const v = value[0];
  return (
    <Select
      value={v}
      onChange={(v) => {
        if (v && v.value) {
          setPosition(v.value);
        }
      }}
      options={options}
    />
  );
}
