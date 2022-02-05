import React from 'react';
import { Card, Container, Row, Col, Image, Table } from 'react-bootstrap';
import { getMotionCorrectionDrift } from 'api/ispyb';
import Zoom from 'react-medium-image-zoom';
import { Movie } from 'pages/em/model';
import InstrumentMicrographParameters from 'pages/em/movie/micrograph/instrumentmicrographparameters';

interface Props {
  dataCollectionId: number;
  proposalName: string;
  movie: Movie;
}

export default function Micrograph(props: Props) {
  const { proposalName, dataCollectionId, movie } = props;
  return (
    <Container>
      <Row>
        <Col md={6}>
          <InstrumentMicrographParameters {...props}></InstrumentMicrographParameters>
        </Col>

        <Col md={6}>
          <Card style={{ width: '18rem', margin: 5 }}>
            <div style={{ margin: 5 }}>
              <Zoom>
                <Image
                  fluid
                  thumbnail
                  src={
                    getMotionCorrectionDrift({
                      proposalName,
                      dataCollectionId,
                      movieId: movie.MotionCorrection_movieId,
                    }).url
                  }
                />
              </Zoom>
            </div>
            <Card.Body>
              <Card.Title>Motion Correction Drift</Card.Title>
              <Card.Text></Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
