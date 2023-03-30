import {
  containerCanGoInLocation,
  getSampleChanger,
} from 'legacy/helpers/mx/samplehelper';
import { range } from 'lodash';
import { Beamline } from 'legacy/models';
import { ContainerDewar } from 'legacy/pages/model';
import { useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { findBestDefaultBeamline } from './dndloadsamplechanger';
import Select from 'react-select';

import './tableloadsamplechanger.scss';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TanstackBootstrapTable } from 'components/Layout/TanstackBootstrapTable';

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

  const columns: ColumnDef<ContainerDewar>[] = [
    {
      header: 'Shipment',
      footer: 'Shipment',
      accessorKey: 'shippingName',
    },
    {
      header: 'Container',
      footer: 'Container',
      accessorKey: 'containerCode',
    },
    {
      header: 'Type',
      footer: 'Type',
      accessorKey: 'containerType',
    },
    {
      header: 'Beamline',
      footer: 'Beamline',
      accessorKey: 'beamlineLocation',
      cell: (info) => {
        return (
          <BeamLineSelector
            beamline={getContainerBeamline(info.row.original)}
            beamlines={beamlines}
            setBeamline={(b) => {
              setContainerLocation(
                info.row.original.containerId,
                b.name,
                undefined
              );
            }}
          ></BeamLineSelector>
        );
      },
    },
    {
      header: 'Position',
      footer: 'Position',
      accessorKey: 'sampleChangerLocation',
      cell: (info) => {
        return (
          <PositionSelector
            container={info.row.original}
            beamline={getContainerBeamline(info.row.original)}
            setPosition={(pos) => {
              setContainerLocation(
                info.row.original.containerId,
                info.row.original.beamlineLocation,
                pos
              );
            }}
          ></PositionSelector>
        );
      },
    },
  ];
  const table = useReactTable({
    data: dewars,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });
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
        <TanstackBootstrapTable table={table} />
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
