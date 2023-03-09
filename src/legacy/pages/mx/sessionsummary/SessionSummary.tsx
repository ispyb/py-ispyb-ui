import Loading from 'components/Loading';
import { Suspense, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MXPage from '../mxpage';
import { ProteinsInfo } from './ProteinsInfo';
import { SessionInfo } from './SessionInfo';
import { ShippingsInfo } from './ShippingsInfo';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXSessionSummaryPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();

  const [selected, setSelected] = useState('shipping');

  return (
    <MXPage sessionId={sessionId} proposalName={proposalName}>
      <Card>
        <Suspense fallback={<Loading />}>
          <SessionInfo sessionId={sessionId} proposalName={proposalName} />
        </Suspense>
        <Container fluid>
          <Container fluid>
            <div
              style={{ borderBottom: '1px solid grey', marginBottom: '1rem' }}
            />

            <Row>
              <Col xs={'auto'} style={{ marginBottom: '1rem' }}>
                <Button
                  variant={
                    selected === 'shipping' ? 'primary' : 'outline-primary'
                  }
                  onClick={() => setSelected('shipping')}
                >
                  Shippings
                </Button>
              </Col>
              <Col xs={'auto'} style={{ marginBottom: '1rem' }}>
                <Button
                  variant={
                    selected === 'protein' ? 'primary' : 'outline-primary'
                  }
                  onClick={() => setSelected('protein')}
                >
                  Proteins
                </Button>
              </Col>
            </Row>
            <div
              style={{ borderBottom: '1px solid grey', marginBottom: '1rem' }}
            />
          </Container>
        </Container>
        {selected === 'shipping' && (
          <Suspense fallback={<Loading />}>
            <ShippingsInfo sessionId={sessionId} proposalName={proposalName} />
          </Suspense>
        )}
        {selected === 'protein' && (
          <Suspense fallback={<Loading />}>
            <ProteinsInfo sessionId={sessionId} proposalName={proposalName} />
          </Suspense>
        )}
      </Card>
    </MXPage>
  );
}
