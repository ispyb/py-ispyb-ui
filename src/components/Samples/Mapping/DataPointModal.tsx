import { Suspense } from 'react';
import { useSuspense } from 'rest-hooks';

import { Modal } from 'react-bootstrap';
import DataViewer from 'components/Events/DataCollections/Mapping/DataViewer';
import { EventResource } from 'api/resources/Event';
import type { DataCollection } from 'models/Event.d';
import Metadata from 'components/Events/Metadata';

interface IDataPointModal {
  dataCollectionId: number;
  selectedPoint: number;
  show?: boolean;
  onHide?: () => void;
}

function DataPointModalMain({
  dataCollectionId,
  selectedPoint,
  show,
  onHide,
}: IDataPointModal) {
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
        <Modal.Title>Data Viewer</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Metadata
          properties={[
            { title: 'Point', content: selectedPoint },
            {
              title: 'File',
              content: `${dataCollection.imageDirectory}/${dataCollection.fileTemplate}`,
            },
          ]}
        />
        <Suspense fallback="Loading...">
          {dataCollection && (
            <div style={{ minHeight: '70vh', display: 'flex' }}>
              <DataViewer
                dataCollection={dataCollection}
                selectedPoint={selectedPoint}
              />
            </div>
          )}
        </Suspense>
      </Modal.Body>
    </Modal>
  );
}

export default function DataPointModal(props: IDataPointModal) {
  return (
    <Suspense>
      <DataPointModalMain {...props} />
    </Suspense>
  );
}
