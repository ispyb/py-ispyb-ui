import { Movie } from 'legacy/pages/em/model';

const MOTION_THRESHOLD = 1000;
const RESOLUTION_THRESHOLD = 5;

export function isMotionThreshold(movie: Movie) {
  return parseFloat(movie.MotionCorrection_totalMotion) > MOTION_THRESHOLD;
}

export function isResolutionLimitThreshold(movie: Movie) {
  return parseFloat(movie.CTF_resolutionLimit) > RESOLUTION_THRESHOLD;
}

export function createImageNumberAndFileName(movies: Movie[]) {
  if (movies.length > 0) {
    movies.sort(function (a, b) {
      return a.Movie_movieId - b.Movie_movieId;
    });
    const startMovieId = movies[0].Movie_movieId;
    movies.forEach(function (element) {
      element.Movie_movieNumber = element.Movie_movieId - startMovieId + 1;
      element.Movie_fileName = element.Movie_movieFullPath.substring(
        element.Movie_movieFullPath.lastIndexOf('/') + 1
      );
      const fileNameLength = element.Movie_fileName.length;
      if (element.Movie_fileName.length > 25) {
        element.Movie_fileName =
          element.Movie_fileName.substring(0, 10) +
          '...' +
          element.Movie_fileName.substring(fileNameLength - 15, fileNameLength);
      }
    });
  }
  return movies.reverse();
}
