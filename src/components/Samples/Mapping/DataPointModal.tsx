import { Suspense } from 'react';
import { useSuspense } from 'rest-hooks';

import { Modal } from 'react-bootstrap';
import DataViewer from 'components/Events/DataCollections/Mapping/DataViewer';
import { EventResource } from 'api/resources/Event';
import type { DataCollection } from 'models/Event.d';

export default function DataPointModal({
  dataCollectionId,
  selectedPoint,
  show,
  onHide,
}: {
  dataCollectionId: number;
  selectedPoint: number;
  show?: boolean;
  onHide?: () => void;
}) {
  const events = useSuspense(EventResource.list(), {
    dataCollectionId: dataCollectionId,
  });
  const dataCollection = events.results[0].Item as DataCollection;

  return (
    <Modal
      size="lg"
      fullscreen="sm-down"
      show={show}
      onHide={onHide}
      title="Attachments"
    >
      <Modal.Header closeButton>
        <Modal.Title>Data Viewer {dataCollectionId}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Suspense fallback="Loading...">
          {dataCollection && (
            <DataViewer
              dataCollection={dataCollection}
              selectedPoint={selectedPoint}
            />
          )}
        </Suspense>
      </Modal.Body>
    </Modal>
  );
}
