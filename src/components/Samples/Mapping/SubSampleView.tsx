import { Suspense, useState } from 'react';
import { useSuspense } from 'rest-hooks';
import classNames from 'classnames';
import { Eye, EyeSlash, Search } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';

import { MapResource } from 'api/resources/Map';
import { EventResource } from 'api/resources/Event';
import Table from 'components/Layout/Table';
import Loading from 'components/Loading';
import DataCollectionAttachmentPlot from 'components/Events/DataCollections/DataCollectionAttachmentPlot';
import { getROIName } from './Maps';

function DataCollectionAttachmentPlotModal({
  dataCollectionId,
}: {
  dataCollectionId: number;
}) {
  const [showPlot, setShowPlot] = useState<boolean>(false);
  return (
    <>
      <Button size="sm" onClick={() => setShowPlot(true)}>
        <Search />
      </Button>

      {showPlot && (
        <Modal
          size="lg"
          fullscreen="sm-down"
          show={showPlot}
          onHide={() => setShowPlot(false)}
          title="Attachments"
        >
          <Modal.Header closeButton>
            <Modal.Title>Attachment Plot</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Suspense fallback={<Loading />}>
              <DataCollectionAttachmentPlot
                dataCollectionId={dataCollectionId}
                xAxisTitle="Energy (keV)"
                yAxisTitle="Counts"
              />
            </Suspense>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default function SubSampleView({
  blSubSampleId,
}: {
  blSubSampleId: number;
}) {
  const datacollections = useSuspense(EventResource.getList, { blSubSampleId });
  const maps = useSuspense(MapResource.getList, { blSubSampleId });

  return (
    <>
      <h2>Data Collections</h2>
      <Table
        keyId="id"
        results={datacollections.results}
        paginator={{
          total: datacollections.total,
          skip: datacollections.skip,
          limit: datacollections.limit,
        }}
        columns={[
          {
            label: 'ID',
            key: 'id',
            className: 'text-break',
          },
          {
            label: 'Type',
            key: 'Item.DataCollectionGroup.experimentType',
          },
          {
            label: '',
            key: 'attachments',
            className: 'text-nowrap text-end',
            formatter: (row) =>
              row.Item.DataCollectionGroup.experimentType === 'Energy scan' ? (
                <DataCollectionAttachmentPlotModal
                  dataCollectionId={row.Item.dataCollectionId}
                />
              ) : null,
          },
        ]}
        emptyText="No data collections yet"
      />
      <h2>Maps</h2>
      <Table
        keyId="xrfFluorescenceMappingId"
        results={maps.results}
        paginator={{
          total: maps.total,
          skip: maps.skip,
          limit: maps.limit,
        }}
        columns={[
          {
            label: 'ID',
            key: 'xrfFluorescenceMappingId',
            className: 'text-break',
          },
          {
            label: 'ROI',
            key: 'XRFFluorescenceMappingROI.edge',
            formatter: (row) => getROIName(row),
            className: 'text-nowrap',
          },
          {
            label: 'Px',
            key: 'GridInfo.steps_x',
            className: 'text-nowrap',
          },
          {
            label: 'Py',
            key: 'GridInfo.steps_y',
            className: 'text-nowrap',
          },
          {
            label: '',
            key: 'opacity',
            className: 'text-nowrap text-end',
            formatter: (row) => (
              <div
                className={classNames(
                  'btn',
                  'btn-sm',
                  { 'btn-primary': row.opacity },
                  { 'btn-light': !row.opacity }
                )}
              >
                {row.opacity ? <Eye /> : <EyeSlash />}
              </div>
            ),
          },
        ]}
        emptyText="No maps yet"
      />
    </>
  );
}
