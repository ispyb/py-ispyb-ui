import { Col, Container, Row } from 'react-bootstrap';
import React from 'react';
import GridSquarePanelHeader from 'pages/em/gridsquarepanelheader';
import 'react-medium-image-zoom/dist/styles.css';
import 'pages/em/styles.css';
import GridSquare from 'pages/em/gridsquare';
import { SampleList } from 'pages/em/model';

export default function GridSquarePanel({ sampleList }: { sampleList: SampleList }) {
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
                ></GridSquare>
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
}
