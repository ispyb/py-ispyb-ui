import { Card, Col, Container, Row } from 'react-bootstrap';
import GridSquarePanelHeader from 'legacy/pages/em/grid/gridsquarepanelheader';
import 'legacy/pages/em/styles.scss';
import GridSquare from 'legacy/pages/em/grid/gridsquare';
import { SampleList } from 'legacy/pages/em/model';

export default function GridSquarePanel({
  sampleList,
  sessionId,
}: {
  sampleList: SampleList;
  sessionId: string;
}) {
  const { proposalName, grids } = sampleList;
  return (
    <Card style={{ marginBottom: '1rem' }}>
      <Card.Header>
        <GridSquarePanelHeader sampleList={sampleList}></GridSquarePanelHeader>
      </Card.Header>
      <div className="bg-light">
        <Container fluid>
          <Row>
            {grids &&
              grids.map((grid, i) => (
                <Col
                  key={i}
                  xs={12}
                  sm={6}
                  md={4}
                  xl={2}
                  style={{ padding: '0.5rem' }}
                >
                  <GridSquare
                    startTime={grid.startTime}
                    proposalName={proposalName}
                    dataCollectionId={grid.dataCollectionId}
                    movieCount={grid.movieCount}
                    progressMotionCor={grid.progressMotionCor}
                    progressCtf={grid.progressCtf}
                    sessionId={sessionId}
                  ></GridSquare>
                </Col>
              ))}
          </Row>
        </Container>
      </div>
    </Card>
  );
}
