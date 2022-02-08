import React from 'react';
import { getMovieThumbnail } from 'api/ispyb';
import Zoom from 'react-medium-image-zoom';
import { Card, Container, Row, Col, Image } from 'react-bootstrap';
import { Movie } from 'pages/em/model';
import InstrumentMicrographParameters from 'pages/em/movie/micrograph/instrumentmicrographparameters';

interface Props {
  dataCollectionId: number;
  proposalName: string;
  movie: Movie;
}

export default function InstrumentMicrograph(props: Props) {
  const { proposalName, dataCollectionId, movie } = props;

  return (
    <Container>
      <Row>
        <Col md={10}>
          <InstrumentMicrographParameters {...props}></InstrumentMicrographParameters>
        </Col>

        <Col md={2}>
          <Card style={{ width: '18rem', margin: 5 }}>
            <div style={{ margin: 5 }}>
              <Zoom>
                <Image
                  //style={{ width: 50 }}
                  thumbnail
                  src={
                    getMovieThumbnail({
                      proposalName,
                      dataCollectionId,
                      movieId: movie.MotionCorrection_movieId,
                    }).url
                  }
                />
              </Zoom>
            </div>
            <Card.Body>
              <Card.Title>Instrument Micrograph</Card.Title>
              <Card.Text></Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
