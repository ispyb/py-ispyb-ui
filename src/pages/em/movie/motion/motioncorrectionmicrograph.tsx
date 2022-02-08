import React from 'react';
import { Card, Container, Row, Col, Image } from 'react-bootstrap';
import { getMotionCorrectionThumbnail } from 'api/ispyb';
import Zoom from 'react-medium-image-zoom';
import { Movie } from 'pages/em/model';

interface Props {
  dataCollectionId: number;
  proposalName: string;
  movie: Movie;
}

export default function MotionCorrectionMicrograph(props: Props) {
  const { proposalName, dataCollectionId, movie } = props;
  return (
    <Container fluid>
      <Row>
        <Col md={6}>
          <Card style={{ width: '18rem', margin: 5 }}>
            <div style={{ margin: 5 }}>
              <Zoom>
                <Image
                  fluid
                  thumbnail
                  src={
                    getMotionCorrectionThumbnail({
                      proposalName,
                      dataCollectionId,
                      movieId: movie.MotionCorrection_movieId,
                    }).url
                  }
                />
              </Zoom>
            </div>
            <Card.Body>
              <Card.Title>Motion Correction Micrograph</Card.Title>
              <Card.Text></Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
