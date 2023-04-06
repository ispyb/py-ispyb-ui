import { Container, Row, Col, Card } from 'react-bootstrap';
import {
  getMovieThumbnail,
  getMotionCorrectionDrift,
  getMotionCorrectionThumbnail,
  getCTFThumbnail,
} from 'legacy/api/ispyb';
import ZoomImage from 'legacy/components/image/zoomimage';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { convertToFixed, expo } from 'legacy/helpers/numerictransformation';
import { Movie } from 'legacy/pages/em/model';
import {
  isMotionThreshold,
  isResolutionLimitThreshold,
} from 'legacy/pages/em/movie/helper';
import { CopyValue } from 'components/Common/CopyValue';
import { HashAnchorButton, useHashScroll } from 'hooks/hashScroll';
import { formatDateToDayAndTime } from 'helpers/dateparser';

interface Props {
  movie: Movie;
  proposalName: string;
  dataCollectionId: number;
}

export function MovieCard(props: Props) {
  const { movie, proposalName, dataCollectionId } = props;

  const hash = useHashScroll(`${movie.Movie_movieId}`);
  return (
    <Card style={{ margin: 3 }} ref={hash.ref}>
      <Card.Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <strong> {movie.Movie_movieNumber}</strong>
        {formatDateToDayAndTime(movie.Movie_createdTimeStamp)}
        <HashAnchorButton hash={hash.hash} />
      </Card.Header>
      <Card.Body>
        <MoviePanel
          movie={movie}
          proposalName={proposalName}
          dataCollectionId={dataCollectionId}
        ></MoviePanel>
      </Card.Body>
      <Card.Footer>
        <Col>
          <Row>
            <Col xs={'auto'}>
              <CopyValue value={getDirectory(movie)} />
            </Col>
          </Row>
          <Row style={{ marginTop: 5 }}>
            <Col xs={'auto'}>
              <CopyValue value={movie.Movie_movieFullPath} />
            </Col>
          </Row>
        </Col>
      </Card.Footer>
    </Card>
  );
}
function getDirectory(movie: Movie) {
  return movie.Movie_movieFullPath.substring(
    0,
    movie.Movie_movieFullPath.lastIndexOf('/')
  );
}

export default function MoviePanel(props: Props) {
  const { movie, proposalName, dataCollectionId } = props;

  return (
    <Container fluid>
      <Row>
        <Col xs={12} sm={6} lg={4}>
          <Row>
            <Col>
              <SimpleParameterTable
                header="Movie"
                parameters={[
                  { key: 'Number', value: movie.Movie_movieNumber },
                  { key: 'Time', value: movie.Movie_createdTimeStamp },
                  {
                    key: 'Movie File Name',
                    value: movie.Movie_fileName,
                    valueTooltip: movie.Movie_movieFullPath,
                  },
                ]}
              ></SimpleParameterTable>
            </Col>
          </Row>
          <Row>
            <Col>
              <SimpleParameterTable
                header="Position"
                parameters={[
                  { key: 'X', value: expo(movie.Movie_positionX, 3) },
                  { key: 'Y', value: expo(movie.Movie_positionY, 3) },
                ]}
              ></SimpleParameterTable>
            </Col>
          </Row>
          <Row>
            <ZoomImage
              alt="Movie thumbnail"
              aspectRatio="14/10"
              style={{ maxWidth: 300 }}
              src={
                getMovieThumbnail({
                  proposalName,
                  dataCollectionId,
                  movieId: movie.Movie_movieId,
                }).url
              }
            />
          </Row>
        </Col>

        {movie.MotionCorrection_movieId && (
          <Col xs={12} sm={6} lg={4}>
            <Card
              style={{
                padding: '0.5rem',
              }}
            >
              <Container fluid>
                <Row>
                  <strong className="text-center">Motion correction</strong>
                </Row>
                <Row>
                  <Col xs={12}>
                    <SimpleParameterTable
                      header="Motion Correction"
                      parameters={[
                        {
                          key: 'Total Motion',
                          value: movie.MotionCorrection_totalMotion,
                          className: isMotionThreshold(movie)
                            ? 'text-danger'
                            : '',
                        },
                        {
                          key: 'Avg. Motion/frame',
                          value: movie.MotionCorrection_averageMotionPerFrame,
                        },
                        {
                          key: 'Frame Range',
                          value: movie.MotionCorrection_lastFrame,
                        },
                        {
                          key: 'Dose/frame',
                          value: movie.MotionCorrection_dosePerFrame,
                        },
                        { key: 'Total dose', value: movie.Movie_dosePerImage },
                      ]}
                    ></SimpleParameterTable>
                  </Col>
                  <Col xs={6}>
                    <div style={{ margin: 5 }}>
                      <ZoomImage
                        alt="Motion Correction drift"
                        aspectRatio="4/3"
                        style={{ maxWidth: 300 }}
                        src={
                          getMotionCorrectionDrift({
                            proposalName,
                            dataCollectionId,
                            movieId: movie.Movie_movieId,
                          }).url
                        }
                      />
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div style={{ margin: 5 }}>
                      <ZoomImage
                        alt="Motion Correction"
                        aspectRatio="14/10"
                        style={{ maxWidth: 300 }}
                        src={
                          getMotionCorrectionThumbnail({
                            proposalName,
                            dataCollectionId,
                            movieId: movie.Movie_movieId,
                          }).url
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card>
          </Col>
        )}
        {movie.CTF_CTFid && (
          <Col xs={12} sm={12} lg={4}>
            <Card
              style={{
                padding: '0.5rem',
              }}
            >
              <Container fluid>
                <Row>
                  <strong className="text-center">CTF</strong>
                </Row>
                <Row>
                  <Col xs={12} sm={6} lg={12} xxl={6}>
                    <SimpleParameterTable
                      header="CTF Results"
                      parameters={[
                        {
                          key: 'Resolution Limit:',
                          value: convertToFixed(movie.CTF_resolutionLimit, 2),
                          className: isResolutionLimitThreshold(movie)
                            ? 'text-danger'
                            : '',
                        },
                        {
                          key: 'Correlation',
                          value: convertToFixed(
                            movie.CTF_crossCorrelationCoefficient,
                            3
                          ),
                        },
                        {
                          key: 'Defocus U',
                          value: convertToFixed(movie.CTF_defocusU, 0),
                        },
                        {
                          key: 'Defocus V',
                          value: convertToFixed(movie.CTF_defocusV, 0),
                        },
                        { key: 'Angle', value: movie.CTF_angle },
                        {
                          key: 'Estimated B factor',
                          value: convertToFixed(movie.CTF_estimatedBfactor, 1),
                        },
                      ]}
                    ></SimpleParameterTable>
                  </Col>
                  <Col xs={12} sm={6} lg={12} xxl={6}>
                    <div style={{ margin: 5 }}>
                      <ZoomImage
                        alt="CTF"
                        aspectRatio="1/1"
                        style={{ maxWidth: 300 }}
                        src={
                          getCTFThumbnail({
                            proposalName,
                            dataCollectionId,
                            movieId: movie.Movie_movieId,
                          }).url
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}
