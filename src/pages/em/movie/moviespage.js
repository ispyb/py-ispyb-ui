import React from 'react';
import { useParams } from 'react-router-dom';
import { useMoviesByDataCollectionId } from 'hooks/ispyb';
import { Card, ButtonGroup } from 'react-bootstrap';
import ActionToggleButton from 'components/buttons/actiontogglebutton';
import MoviePanel from 'pages/em/movie/moviepanel';
import Menu from 'components/menu/menu';

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

export default function MoviesPage() {
  const { dataCollectionId, proposalName } = useParams();

  let { data: movies, isError: sessionError } = useMoviesByDataCollectionId({ proposalName, dataCollectionId });
  if (sessionError) throw Error(sessionError);

  movies = createImageNumberAndFileName(movies);

  return (
    <div style={{ marginBottom: '100px' }}>
      <Menu>
        <ButtonGroup className="mb-2">
          <ActionToggleButton text="Test" checked={false} action={alert('asdadsa')} actionType={''} />
        </ButtonGroup>
      </Menu>

      {movies.map((movie) => (
        <Card style={{ margin: 3 }}>
          <Card.Body>
            <MoviePanel movie={movie} proposalName={proposalName} dataCollectionId={dataCollectionId}></MoviePanel>
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
