import Loading from 'components/Loading';
import { usePersistentParamState } from 'hooks/useParam';
import { Suspense } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ProteinsInfo } from './ProteinsInfo';
import { SessionInfo } from './SessionInfo';
import { ShippingsInfo } from './ShippingsInfo';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXSessionSummaryPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();

  const [selected, setSelected] = usePersistentParamState<'sample' | 'target'>(
    'view',
    'sample'
  );

  return (
    <>
      <Suspense fallback={<Loading />}>
        <SessionInfo sessionId={sessionId} proposalName={proposalName} />
      </Suspense>
      <Container fluid>
        <Container fluid style={{ marginBottom: '1rem' }}>
          <div
            style={{ borderBottom: '1px solid grey', marginBottom: '1rem' }}
          />

          <Row>
            <Col xs={'auto'} style={{ display: 'flex', alignItems: 'center' }}>
              <strong>Select view by:</strong>
            </Col>
            <Col xs={'auto'}>
              <Button
                size="sm"
                variant={selected === 'sample' ? 'primary' : 'outline-primary'}
                onClick={() => setSelected('sample')}
              >
                Sample
              </Button>
            </Col>
            <Col xs={'auto'}>
              <Button
                size="sm"
                variant={selected === 'target' ? 'primary' : 'outline-primary'}
                onClick={() => setSelected('target')}
              >
                Target
              </Button>
            </Col>
          </Row>
          <div style={{ borderBottom: '1px solid grey', marginTop: '1rem' }} />
        </Container>
      </Container>
      {selected === 'sample' && (
        <Suspense fallback={<Loading />}>
          <ShippingsInfo sessionId={sessionId} proposalName={proposalName} />
        </Suspense>
      )}
      {selected === 'target' && (
        <Suspense fallback={<Loading />}>
          <ProteinsInfo sessionId={sessionId} proposalName={proposalName} />
        </Suspense>
      )}
    </>
  );
}
