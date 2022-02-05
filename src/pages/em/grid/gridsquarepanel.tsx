import { Col, Container, Row } from 'react-bootstrap';
import React from 'react';
import GridSquarePanelHeader from 'pages/em/grid/gridsquarepanelheader';
import 'react-medium-image-zoom/dist/styles.css';
import 'pages/em/styles.css';
import GridSquare from 'pages/em/grid/gridsquare';
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

/*
 <GridSquarePanelHeader sampleList={sampleList}></GridSquarePanelHeader>
      <Table striped bordered hover responsive>
        {grids &&
          grids.map((grid) => (
            <tr>
              <td>
                <Zoom>
                  <Image width="120" rounded thumbnail src={getCrystalImage({ proposalName, dataCollectionId: grid.dataCollectionId, imageIndex: 1 }).url} />
                </Zoom>
              </td>
              <td>{grid.startTime}</td>
              <td>{grid.movieCount}</td>
              <td>
                <ProgressBar style={{ height: 50 }} variant="success" now={grid.progressMotionCor} label={`Motion corr: ${grid.progressMotionCor}%`} />
              </td>
              <td>
                <ProgressBar style={{ height: 50 }} variant="success" now={grid.progressMotionCor} label={`Motion corr: ${grid.progressMotionCor}%`} />
              </td>
            </tr>
          ))}
      </Table>
      */
