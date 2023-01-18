import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Metadata from 'components/Events/Metadata';
import { DataCollectionBox } from 'components/Events/DataCollection';
import { IDataCollection } from 'components/Events/DataCollections/Default';

import GridPlot from './GridPlot';
import DataViewer from './DataViewer';

export default function Map(props: IDataCollection) {
  const { parent, item } = props;
  const [selectedPoint, setSelectedPoint] = useState<number>(0);

  const res = (
    <Row className="g-0">
      <Col md="4">
        <Metadata
          properties={[
            {
              title: 'Sample',
              test: parent.blSample,
              content: (
                <Link
                  to={`/proposals/${parent.proposal}/samples/${parent.blSampleId}`}
                >
                  {parent.blSample}
                </Link>
              ),
            },
            {
              title: 'Group',
              test: parent.count > 1,
              content: (
                <Link
                  to={`/proposals/${parent.proposal}/sessions/${parent.sessionId}?dataCollectionGroupId=${item.DataCollectionGroup.dataCollectionGroupId}`}
                >
                  {parent.count} Data Collections
                </Link>
              ),
            },
            {
              title: 'Type',
              content: item.DataCollectionGroup.experimentType,
            },
            { title: 'Status', content: item.runStatus },
            {
              title: 'Finished',
              content: parent.endTime,
              test: parent.endTime,
            },
            {
              title: 'Duration',
              content: parent.duration ? Math.round(parent.duration) : 0,
              unit: 'min',
            },
            { title: 'Wavelength', content: item.wavelength, unit: 'Å' },
            { title: 'No. Points', content: item.numberOfImages },
            {
              title: 'Exposure Time',
              content: item.exposureTime,
              unit: 's',
            },
            ...(item.GridInfo?.length
              ? [
                  {
                    title: 'Step Size',
                    content: `${(item.GridInfo?.[0].dx_mm || 0) * 1e3} x ${
                      (item.GridInfo?.[0].dy_mm || 0) * 1e3
                    }`,
                    unit: 'µm',
                  },
                  {
                    title: 'Steps',
                    content: `${item.GridInfo?.[0].steps_x} x ${item.GridInfo?.[0].steps_y}`,
                  },
                ]
              : []),
          ]}
        />
      </Col>
      <Col xs="12" md="4" className="bg-light">
        <DataViewer
          selectedPoint={selectedPoint}
          dataCollection={item}
        />
      </Col>
      <Col xs="12" md="4">
        {item.GridInfo && item.GridInfo.length > 0 && (
          <GridPlot
            gridInfo={item.GridInfo[0]}
            dataCollectionId={item.dataCollectionId}
            setSelectedPoint={setSelectedPoint}
            snapshotAvailable={item._metadata.snapshots['1']}
          />
        )}
      </Col>
    </Row>
  );

  return <DataCollectionBox {...props}>{res}</DataCollectionBox>;
}
