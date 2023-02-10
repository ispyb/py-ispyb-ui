import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Metadata from 'components/Events/Metadata';
import { DataCollectionBox } from 'components/Events/DataCollection';
import { IDataCollection } from 'components/Events/DataCollections/Default';
import PerImageAnalysis from 'components/Events/PerImageAnalysis';

import GridPlot from './GridPlot';
import DataViewer from './DataViewer';
import { toEnergy } from 'utils/numbers';
import StatusBadge from '../StatusBadge';

export default function MapXAS(props: IDataCollection) {
  const { parent, item } = props;
  const [selectedPoint, setSelectedPoint] = useState<number | undefined>(
    undefined
  );

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
            {
              title: 'Status',
              content: <StatusBadge status={item.runStatus} />,
            },
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
            {
              title: 'Energy',
              content: item.wavelength && toEnergy(item.wavelength),
              unit: 'keV',
            },
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
      <Col xs="12" md="3" className="bg-light">
        {selectedPoint !== undefined && (
          <DataViewer selectedPoint={selectedPoint} dataCollection={item} />
        )}
        {selectedPoint === undefined && (
          <p>Select a point to view the related data</p>
        )}
      </Col>
      <Col xs="12" md="3">
        {item.GridInfo && item.GridInfo.length > 0 && (
          <GridPlot
            gridInfo={item.GridInfo[0]}
            dataCollectionGroupId={
              parent.count > 1
                ? item.DataCollectionGroup.dataCollectionGroupId
                : undefined
            }
            dataCollectionId={item.dataCollectionId}
            setSelectedPoint={setSelectedPoint}
            snapshotAvailable={item._metadata.snapshots['1']}
            scrollMaps={parent.count > 1}
          />
        )}
      </Col>
      <Col className="text-center bg-light" xs="12" md="2">
        <PerImageAnalysis
          dataCollectionId={item.dataCollectionId}
          endTime={parent.endTime}
          xAxisTitle="Sum XANES"
          yAxisTitle="Counts"
        />
      </Col>
    </Row>
  );

  return <DataCollectionBox {...props}>{res}</DataCollectionBox>;
}
