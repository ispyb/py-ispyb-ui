import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMoviesByDataCollectionId } from 'legacy/hooks/ispyb';
import {
  ButtonGroup,
  Badge,
  ToggleButton,
  Alert,
  Button,
  Col,
  Row,
} from 'react-bootstrap';
import { MovieCard } from 'legacy/pages/em/movie/moviepanel';
import Menu from 'legacy/components/menu/menu';
import {
  createImageNumberAndFileName,
  isMotionThreshold,
  isResolutionLimitThreshold,
} from 'legacy/pages/em/movie/helper';
import { Movie } from 'legacy/pages/em/model';
import Paginator from 'components/Layout/Paginator';
import { usePaging } from 'hooks/usePaging';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from '@fortawesome/free-solid-svg-icons';

export default function MoviesPage() {
  const navigate = useNavigate();

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

  const pagination = usePaging(100, 0);

  return (
    <div style={{ marginBottom: '100px' }}>
      <Menu>
        <Col>
          <Row>
            <Col xs={'auto'}>
              <Button
                variant={'secondary'}
                onClick={() => {
                  navigate('../summary');
                }}
              >
                <FontAwesomeIcon
                  icon={faBackward}
                  style={{
                    marginRight: '0.5rem',
                  }}
                />
                Back to grid squares
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={'auto'} style={{ paddingTop: '1rem' }}>
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
                  <Badge bg="danger">
                    {moviesReachingMoviewThreshold.length}
                  </Badge>
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
            </Col>
          </Row>
        </Col>
      </Menu>
      {parsedMovies.length ? (
        <>
          <Paginator
            total={parsedMovies.length}
            skip={pagination.skip}
            limit={pagination.limit}
          />
          {parsedMovies
            .slice(pagination.skip, pagination.skip + pagination.limit)
            .map((movie: Movie) => (
              <MovieCard
                key={movie.Movie_movieId}
                movie={movie}
                proposalName={proposalName}
                dataCollectionId={Number(dataCollectionId)}
              />
            ))}
          <Paginator
            total={parsedMovies.length}
            skip={pagination.skip}
            limit={pagination.limit}
          />
        </>
      ) : (
        <Alert variant={'info'}>No movies found for selection</Alert>
      )}
    </div>
  );
}
