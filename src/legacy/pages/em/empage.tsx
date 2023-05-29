import { PropsWithChildren, Suspense } from 'react';
import SessionTabMenu from 'legacy/pages/em/sessiontabmenu';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useEMDataCollectionsBy } from 'legacy/hooks/ispyb';
import { usePersistentParamState } from 'hooks/useParam';
import Loading from 'components/Loading';

type Props = PropsWithChildren<{
  sessionId: string;
  proposalName: string;
}>;

export default function EMPage({ children, sessionId, proposalName }: Props) {
  const grids =
    useEMDataCollectionsBy({
      proposalName,
      sessionId,
    }).data || [];
  const [grid, setGrid] = usePersistentParamState<string>('grid', 'all');

  return (
    <>
      <Card style={{ marginBottom: 10, padding: 10 }}>
        <Col>
          <Row>
            <Col>
              <strong>Grids</strong>
            </Col>
          </Row>
          <Row style={{ paddingLeft: '0.5rem' }}>
            <Col xs={'auto'} style={{ padding: '0.5rem' }}>
              <Button
                size="sm"
                variant={grid === 'all' ? 'primary' : 'outline-primary'}
                onClick={() => {
                  setGrid('all');
                }}
              >
                All
              </Button>
            </Col>
            {grids.map((gridObject, i) => (
              <Col
                key={gridObject.BLSample_name}
                xs={'auto'}
                style={{ padding: '0.5rem' }}
              >
                <Button
                  size="sm"
                  variant={
                    grid === gridObject.BLSample_name
                      ? 'primary'
                      : 'outline-primary'
                  }
                  onClick={() => {
                    setGrid(gridObject.BLSample_name);
                  }}
                >
                  {gridObject.BLSample_name}
                </Button>
              </Col>
            ))}
          </Row>
        </Col>
      </Card>
      <SessionTabMenu
        sessionId={sessionId}
        proposalName={proposalName}
      ></SessionTabMenu>
      <div
        style={{
          borderBottom: '1px solid #dee2e6',
          borderLeft: '1px solid #dee2e6',
          borderRight: '1px solid #dee2e6',
          padding: 1,
        }}
      >
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </>
  );
}
