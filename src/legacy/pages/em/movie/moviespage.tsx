import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMoviesByDataCollectionId } from 'legacy/hooks/ispyb';
import { Card, ButtonGroup, Badge, ToggleButton } from 'react-bootstrap';
import MoviePanel from 'legacy/pages/em/movie/moviepanel';
import Menu from 'legacy/components/menu/menu';
import {
  createImageNumberAndFileName,
  isMotionThreshold,
  isResolutionLimitThreshold,
} from 'legacy/pages/em/movie/helper';
import { Movie } from 'legacy/pages/em/model';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import LoadingPanel from 'legacy/components/loading/loadingpanel';

export default function MoviesPage() {
  const { dataCollectionId = '', proposalName = '' } = useParams<{
    dataCollectionId: string;
    proposalName: string;
  }>();

  const [isMotion, setisMotion] = useState(false);
  const [isResolution, setisResolution] = useState(false);

  const { data: movies, isError: sessionError } = useMoviesByDataCollectionId({
    proposalName,
    dataCollectionId: parseFloat(dataCollectionId),
  });
  if (sessionError) throw Error(sessionError);

  /** Recalculation imageNumber and File name */
  let parsedMovies = createImageNumberAndFileName(movies);

  const moviesReachingResolutionLimitThreshold = parsedMovies.filter(
    (movie: Movie) => isResolutionLimitThreshold(movie)
  );
  const moviesReachingMoviewThreshold = parsedMovies.filter((movie: Movie) =>
    isMotionThreshold(movie)
  );

  if (isMotion && !isResolution) {
    parsedMovies = moviesReachingMoviewThreshold;
  }

  if (isResolution && !isMotion) {
    parsedMovies = moviesReachingResolutionLimitThreshold;
  }

  if (isResolution && isMotion) {
    parsedMovies = parsedMovies.filter(
      (movie: Movie) =>
        isResolutionLimitThreshold(movie) && isMotionThreshold(movie)
    );
  }

  return (
    <div style={{ marginBottom: '100px' }}>
      <Menu>
        <ButtonGroup className="mb-2">
          <ToggleButton
            variant={isMotion ? 'outline-primary' : 'light'}
            checked={isMotion}
            id="tbg-btn-1"
            value={1}
            style={{ margin: 1 }}
            size="sm"
            type="checkbox"
            onClick={() => setisMotion(!isMotion)}
          >
            Motion Threshold{' '}
            <Badge bg="danger">{moviesReachingMoviewThreshold.length}</Badge>
          </ToggleButton>
          <ToggleButton
            variant={isResolution ? 'outline-primary' : 'light'}
            checked={isResolution}
            id="tbg-btn-2"
            value={2}
            style={{ margin: 1 }}
            size="sm"
            type="checkbox"
            onClick={() => setisResolution(!isResolution)}
          >
            Resolution Threshold{' '}
            <Badge bg="danger">
              {moviesReachingResolutionLimitThreshold.length}
            </Badge>
          </ToggleButton>
        </ButtonGroup>
      </Menu>

      {parsedMovies.map((movie: Movie) => (
        <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
          <Card style={{ margin: 3 }}>
            <Card.Body>
              <MoviePanel
                movie={movie}
                proposalName={proposalName}
                dataCollectionId={parseFloat(dataCollectionId)}
              ></MoviePanel>
            </Card.Body>
            <Card.Footer>
              <p className="text-primary" style={{ fontSize: 'smaller' }}>
                {getDirectory(movies)}
                <br />
                {movie.Movie_movieFullPath}
              </p>
            </Card.Footer>
          </Card>
        </LazyWrapper>
      ))}
    </div>
  );
}

function getDirectory(movies: Movie[]) {
  if (movies.length > 0) {
    return movies[0].Movie_movieFullPath.substring(
      0,
      movies[0].Movie_movieFullPath.lastIndexOf('/')
    );
  }
}
