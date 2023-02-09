import { Col, Row, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { EventHeader } from './Events';
import Metadata from './Metadata';
import { RobotAction as RobotActionType, Event } from 'models/Event';

export default function RobotAction(props: {
  item: RobotActionType;
  parent: Event;
}) {
  const { item, parent } = props;
  return (
    <>
      <EventHeader event={parent} title={item.actionType} />
      <Container fluid className="g-0">
        <Row>
          <Col>
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
                { title: 'Status', content: item.status },
                { title: 'Message', content: item.message, test: item.message },
              ]}
            />
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}
