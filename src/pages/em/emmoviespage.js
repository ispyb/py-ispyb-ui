import React from 'react';
import { useParams } from 'react-router-dom';
import { useMoviesByDataCollectionId } from 'hooks/ispyb';
import { Container, Row, Col, Card } from 'react-bootstrap';
import InstrumentMicrograph from 'pages/em/movie/micrograph/instrumentmicrograph';
import MotionCorrection from 'pages/em/movie/motion/motioncorrection';
import MotionCorrectionMicrograph from 'pages/em/movie/motion/motioncorrectionmicrograph';

function createImageNumberAndFileName(movies) {
  if (movies.length > 0) {
    movies.sort(function (a, b) {
      return a.Movie_movieId - b.Movie_movieId;
    });
    const startMovieId = movies[0].Movie_movieId;
    movies.forEach(function (element) {
      element.Movie_movieNumber = element.Movie_movieId - startMovieId + 1;
      element.Movie_fileName = element.Movie_movieFullPath.substring(element.Movie_movieFullPath.lastIndexOf('/') + 1);
      const fileNameLength = element.Movie_fileName.length;
      if (element.Movie_fileName.length > 25) {
        element.Movie_fileName = element.Movie_fileName.substring(0, 10) + '...' + element.Movie_fileName.substring(fileNameLength - 15, fileNameLength);
      }
    });
  }
  return movies.reverse();
}

export default function EMMoviesPage() {
  const { dataCollectionId, proposalName } = useParams();

  let { data: movies, isError: sessionError } = useMoviesByDataCollectionId({ proposalName, dataCollectionId });
  if (sessionError) throw Error(sessionError);

  movies = createImageNumberAndFileName(movies);
  console.log(movies);
  return (
    <div style={{ marginBottom: '100px' }}>
      {movies.map((movie) => (
        <Card>
          <Card.Body>
            <Container fluid>
              <Row>
                <Col xs={3} style={{ backgroundColor: 'gray' }}>
                  <InstrumentMicrograph movie={movie} proposalName={proposalName} dataCollectionId={dataCollectionId}></InstrumentMicrograph>
                </Col>
                <Col xs={4} style={{ backgroundColor: 'red' }}>
                  <MotionCorrection movie={movie} proposalName={proposalName} dataCollectionId={dataCollectionId}></MotionCorrection>
                </Col>
                <Col xs={4} style={{ backgroundColor: 'gray' }}>
                  <MotionCorrectionMicrograph movie={movie} proposalName={proposalName} dataCollectionId={dataCollectionId}></MotionCorrectionMicrograph>
                </Col>
                <Col xs={4} style={{ backgroundColor: 'blue' }}>
                  Last
                </Col>
              </Row>
            </Container>
          </Card.Body>
          <Card.Footer>
            <strong>{getDirectory(movies)}</strong>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}

function getDirectory(movies) {
  if (movies.length > 0) {
    return movies[0].Movie_movieFullPath.substring(0, movies[0].Movie_movieFullPath.lastIndexOf('/'));
  }
}
