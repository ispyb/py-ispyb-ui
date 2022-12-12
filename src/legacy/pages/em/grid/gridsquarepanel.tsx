import { Col, Container, Row } from 'react-bootstrap';
import React from 'react';
import GridSquarePanelHeader from 'legacy/pages/em/grid/gridsquarepanelheader';
import 'react-medium-image-zoom/dist/styles.css';
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
    <>
      <GridSquarePanelHeader sampleList={sampleList}></GridSquarePanelHeader>
      <Container fluid>
        <Row>
          {grids &&
            grids.map((grid) => (
              <Col xs={12} sm={4} md={4} lg={2}>
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
    </>
  );
}
