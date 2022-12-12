import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { IDataCollection } from './Default';
import Metadata from '../Metadata';
import Snapshot from './Snapshot';
import { DataCollectionBox } from '../DataCollection';

function EMGridSquare({ parent, item }: IDataCollection) {
  return (
    <Row className="g-0">
      <Col md="9">
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
              title: 'Finished',
              content: parent.endTime,
              test: parent.endTime,
            },
            {
              title: 'Frames / Movie',
              content: item.numberOfImages,
            },
          ]}
        />
      </Col>
      <Col className="text-center bg-light" xs="12" md="3">
        <Snapshot item={item} />
      </Col>
    </Row>
  );
}

function EMGroup({ parent, item }: IDataCollection) {
  return (
    <Row className="g-0">
      <Col md="9">
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
              content: (
                <Link
                  to={`/proposals/${parent.proposal}/sessions/${parent.sessionId}?dataCollectionGroupId=${item.DataCollectionGroup.dataCollectionGroupId}`}
                >
                  {parent.count} Grid Squares
                </Link>
              ),
            },
            {
              title: 'Finished',
              content: parent.endTime,
              test: parent.endTime,
            },
            {
              title: 'Voltage',
              content: item.voltage,
              unit: 'V',
            },
            {
              title: 'Magnification',
              content: item.magnification,
              unit: 'x',
            },
          ]}
        />
      </Col>
      <Col className="text-center bg-light" xs="12" md="3">
        <Snapshot item={item} />
      </Col>
    </Row>
  );
}

export default function EM(props: IDataCollection) {
  const res = props.isGroup ? (
    <EMGroup {...props} />
  ) : (
    <EMGridSquare {...props} />
  );
  return <DataCollectionBox {...props}>{res}</DataCollectionBox>;
}
