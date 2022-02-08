import React from 'react';
import { useParams } from 'react-router-dom';
import { useMoviesByDataCollectionId } from 'hooks/ispyb';
import { Card, ButtonGroup, Badge, ToggleButton } from 'react-bootstrap';
import MoviePanel from 'pages/em/movie/moviepanel';
import Menu from 'components/menu/menu';
import { createImageNumberAndFileName } from 'pages/em/movie/helper';
import { Movie } from 'pages/em/model';

export default function MoviesPage() {
  const { dataCollectionId = '', proposalName = '' } = useParams<{ dataCollectionId: string; proposalName: string }>();

  const { data: movies, isError: sessionError } = useMoviesByDataCollectionId({ proposalName, dataCollectionId: parseFloat(dataCollectionId) });
  if (sessionError) throw Error(sessionError);

  /** Recalculation imageNumber and File name */
  const parsedMovies = createImageNumberAndFileName(movies);

  //const moviesReachingResolutionLimitThreshold = movies.filter((movie: Movie) => isResolutionLimitThreshold(movie));
  //const moviesReachingMoviewThreshold = movies.filter((movie: Movie) => isMotionThreshold(movie));

  //const e = <Badge bg="danger">{moviesReachingMoviewThreshold.length}</Badge>;
  return (
    <div style={{ marginBottom: '100px' }}>
      <Menu>
        <ButtonGroup className="mb-2">
          <ToggleButton id="tbg-btn-1" value={1} style={{ margin: 1 }} size="sm" type="checkbox" onClick={() => alert('test')}>
            Motion Threshold <Badge bg="warning">asdsad</Badge>
          </ToggleButton>
          <ToggleButton id="tbg-btn-2" value={2} style={{ margin: 1 }} size="sm" type="checkbox" onClick={() => alert('test')}>
            Resolution Threshold
          </ToggleButton>
        </ButtonGroup>
      </Menu>

      {parsedMovies.map((movie: Movie) => (
        <Card style={{ margin: 3 }}>
          <Card.Body>
            <MoviePanel movie={movie} proposalName={proposalName} dataCollectionId={parseFloat(dataCollectionId)}></MoviePanel>
          </Card.Body>
          <Card.Footer>
            <strong>{getDirectory(movies)}</strong>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}

function getDirectory(movies: Movie[]) {
  if (movies.length > 0) {
    return movies[0].Movie_movieFullPath.substring(0, movies[0].Movie_movieFullPath.lastIndexOf('/'));
  }
}
