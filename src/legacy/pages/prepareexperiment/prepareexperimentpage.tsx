import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import { useDewars } from 'legacy/hooks/ispyb';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { ContainerDewar } from 'legacy/pages/model';
import './prepareexperimentpage.scss';
import { formatDateTo, parseDate } from 'legacy/helpers/dateparser';
import {
  faAngleDown,
  faAngleUp,
  faPlus,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import {
  updateSampleChangerLocation,
  updateShippingStatus,
} from 'legacy/api/ispyb';
import { KeyedMutator } from 'swr';
import produce from 'immer';
import LoadSampleChanger from './loadsamplechanger';
import { Shipment } from 'legacy/pages/model';
import { useMemo, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TanstackBootstrapTable } from 'components/Layout/TanstackBootstrapTable';

type Param = {
  proposalName: string;
};

export default function PrepareExperimentPage() {
  const [compactStep1, setCompactStep1] = useState(false);
  const { site, token } = useAuth();

  const { proposalName = '' } = useParams<Param>();
  const { data, isError, mutate } = useDewars({ proposalName });
  if (isError) throw Error(isError);
  if (!data) throw Error('error while fetching dewars');

  const setContainerLocation = (
    containerId: number,
    beamline: string | undefined,
    position: string | undefined
  ) => {
    mutate(
      produce((dewarsDraft: ContainerDewar[] | undefined) => {
        if (dewarsDraft) {
          for (const dewarDraft of dewarsDraft) {
            if (dewarDraft.containerId === containerId) {
              if (position !== undefined) {
                dewarDraft.sampleChangerLocation = position;
              }
              if (beamline !== undefined) {
                dewarDraft.beamlineLocation = beamline;
              }
            }
          }
        }
      }),
      false
    );
    let req: ReturnType<typeof updateSampleChangerLocation> | undefined;
    if (beamline !== undefined) {
      req = updateSampleChangerLocation({
        proposalName,
        containerId: containerId,
        beamline: beamline,
        position,
      });
    } else {
      for (const d of data) {
        if (d.containerId === containerId) {
          req = updateSampleChangerLocation({
            proposalName,
            containerId: containerId,
            beamline: d.beamlineLocation || 'undefined',
            position,
          });
        }
      }
    }
    if (req) {
      const fullUrl = `${site.host}${site.apiPrefix}/${token}${req.url}`;

      axios.post(fullUrl, req.data, { headers: req.headers }).then(
        () => {
          mutate();
        },
        () => {
          mutate();
        }
      );
    } else {
      mutate();
    }
  };

  const shipments = useMemo(
    () =>
      _(data)
        .groupBy((d) => d.shippingId)
        .filter((dewars: ContainerDewar[]) => dewars.length > 0)
        .map((dewars: ContainerDewar[]) => {
          const d = dewars[0];
          const res: Shipment = {
            shippingId: d.shippingId,
            name: d.shippingName,
            status: d.shippingStatus,
            creationDate: d.creationDate,
            dewars: dewars,
          };
          return res;
        })
        .value(),
    [data]
  );

  const processingDewars = _(shipments)
    .filter((s) => Boolean(shipmentIsProcessing(s)))
    .flatMap((s) => s.dewars)
    .filter((d) => d.containerId !== undefined)
    .filter((d) => d.containerId !== null)
    .value();

  const columns: ColumnDef<Shipment>[] = [
    {
      header: '',
      accessorKey: 'shippingId',
      cell: (info) => {
        return (
          <ToggleShipmentStatus
            proposalName={proposalName}
            shipment={info.row.original}
            mutate={mutate}
          ></ToggleShipmentStatus>
        );
      },
      enableColumnFilter: false,
    },
    {
      header: 'Name',
      footer: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Status',
      footer: 'Status',
      accessorKey: 'status',
      enableColumnFilter: false,
    },
    {
      header: 'Created on',
      footer: 'Created on',
      accessorFn: (v) => dateFormatter(v.creationDate),
      enableColumnFilter: false,
    },
  ];
  const sortedShipments = useMemo(
    () => shipments.sort(sortShipments),
    [shipments]
  );
  const table = useReactTable({
    data: sortedShipments,
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
  const step1 = (
    <Card style={{ border: 'none' }}>
      <Card.Header>
        <Row>
          <Col md={'auto'}>
            <h6 style={{ margin: 5 }}>1. Select shipments</h6>
          </Col>
          <Col></Col>
          <Col md={'auto'}>
            <OverlayTrigger
              key={'right'}
              placement={'right'}
              overlay={
                <Tooltip id={`tooltip-right`}>
                  {compactStep1 ? 'Expand' : 'Minify'}
                </Tooltip>
              }
            >
              <Button
                style={{ paddingTop: 0, paddingBottom: 0 }}
                variant="link"
                onClick={() => {
                  setCompactStep1(!compactStep1);
                }}
              >
                <FontAwesomeIcon
                  color="white"
                  size="lg"
                  icon={compactStep1 ? faAngleDown : faAngleUp}
                />
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </Card.Header>
      {!compactStep1 && (
        <Card.Body style={{ padding: 0 }}>
          <TanstackBootstrapTable
            rowStyle={(v) =>
              shipmentIsProcessing(v) ? { backgroundColor: 'lightblue' } : {}
            }
            table={table}
          />
        </Card.Body>
      )}
    </Card>
  );

  const step2 = (
    <LoadSampleChanger
      setContainerLocation={setContainerLocation}
      proposalName={proposalName}
      dewars={processingDewars}
    ></LoadSampleChanger>
  );

  if (compactStep1) {
    return (
      <Col>
        <Row>
          <Col>{step1}</Col>
        </Row>
        <Row>
          <Col>{step2}</Col>
        </Row>
      </Col>
    );
  } else {
    return (
      <Row>
        <Col md={'auto'}>
          <Row>{step1}</Row>
        </Col>
        <Col>{step2}</Col>
      </Row>
    );
  }
}

const dateFormatter = (cell: string) => {
  if (cell) {
    return `${formatDateTo(cell, 'dd/MM/yyyy')}`;
  }
  return cell;
};

const shipmentIsProcessing = (s: Shipment) => {
  return s.status && s.status.toLowerCase().includes('processing') ? 1 : 0;
};

const sortShipments = (a: Shipment, b: Shipment) => {
  const aN = shipmentIsProcessing(a);
  const bN = shipmentIsProcessing(b);
  if (aN === bN) {
    if (a.creationDate && b.creationDate) {
      return (
        parseDate(b.creationDate).getTime() -
        parseDate(a.creationDate).getTime()
      );
    }
    if (a.creationDate) {
      return -1;
    }
    return 1;
  }
  return bN - aN;
};
export function ToggleShipmentStatus({
  shipment,
  proposalName,
  mutate,
}: {
  shipment: Shipment;
  proposalName: string;
  mutate: KeyedMutator<ContainerDewar[]>;
}) {
  const { site, token } = useAuth();
  const isProcessing = shipmentIsProcessing(shipment);
  const newStatus = isProcessing ? 'at_ESRF' : 'processing';
  const onClick = () => {
    mutate(
      produce((dewarsDraft: ContainerDewar[] | undefined) => {
        if (dewarsDraft) {
          for (const dewarDraft of dewarsDraft) {
            if (dewarDraft.shippingId === shipment.shippingId) {
              dewarDraft.shippingStatus = newStatus;
            }
          }
        }
      }),
      false
    );
    const req = updateShippingStatus({
      proposalName,
      shippingId: shipment.shippingId,
      status: newStatus,
    });
    const fullUrl = `${site.host}${site.apiPrefix}/${token}${req.url}`;
    axios.get(fullUrl).then(
      () => {
        mutate();
      },
      () => {
        mutate();
      }
    );
  };
  return (
    <OverlayTrigger
      placement="right"
      overlay={
        <Tooltip>
          {"Set status to '"}
          {newStatus}
          {"'"}
        </Tooltip>
      }
    >
      <Button style={{ padding: 0 }} variant="link" onClick={onClick}>
        <FontAwesomeIcon
          icon={isProcessing ? faTimes : faPlus}
        ></FontAwesomeIcon>
      </Button>
    </OverlayTrigger>
  );
}
