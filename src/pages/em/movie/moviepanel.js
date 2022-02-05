import { Col, Container, Row, Table } from 'react-bootstrap';
import { getCTFThumbnail, getMotionCorrectionDrift, getMotionCorrectionThumbnail, getMovieThumbnail } from 'api/ispyb';

import ImageZoom from 'react-medium-image-zoom';
import PropTypes from 'prop-types';
import React from 'react';
import { getContainerSize } from 'helpers/responsivenesshelper.js';

export default class MoviePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieData: {},
    };
  }

  expo(x, f) {
    return Number.parseFloat(x).toExponential(f);
  }

  round(x, f) {
    const a = Math.pow(10, f);
    return Math.round(Number.parseFloat(x) * a) / a;
  }

  getDateTimeFilenameForSmallDevice() {
    const size = getContainerSize(window);
    if (size === 'xs' || size === 'sm') {
      return (
        <div>
          <Table responsive size="sm">
            <tbody>
              <tr>
                <td className="parameterKey">
                  <center>
                    <strong>Time: {this.props.movieData.Movie_createdTimeStamp}</strong>
                  </center>
                </td>
              </tr>
              <tr>
                <td className="parameterKey">
                  <center>
                    <strong>Movie file name: {this.props.movieData.Movie_fileName}</strong>
                  </center>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      );
    }
  }

  getInstrumentMicrograph() {
    let doDisplay = false;
    const startName = this.props.movieData.Movie_fileName.substring(0, 8);
    if (startName === 'FoilHole') {
      doDisplay = true;
    }
    if (doDisplay) {
      return (
        <div>
          <Col xs={12} sm={2} md={2} lg={2}>
            <center>
              <strong>Instrument Micrograph</strong>
            </center>
            <ImageZoom
              image={{
                style: { width: '100%' },
                src: getMovieThumbnail({
                  proposalName: this.props.proposalName,
                  dataCollectionId: this.props.movieData.Movie_dataCollectionId,
                  movieId: this.props.movieData.Movie_movieId,
                }),
                onError: (a) => {
                  alert(a);
                  a.target.src = '';
                },
              }}
            />
          </Col>
        </div>
      );
    }
    return '';
  }

  getPositionMotionCorrectionTable() {
    if (isNaN(this.props.movieData.MotionCorrection_totalMotion)) {
      return '';
    }
    return (
      <div>
        <Col xs={12} sm={2} md={2} lg={2}>
          <Table responsive size="sm">
            <tbody>
              <tr>
                <td className="parameterKey" colSpan="2">
                  <center>
                    <strong>Position</strong>
                  </center>
                </td>
              </tr>
              <tr>
                <td className="parameterKey">X: {this.expo(this.props.movieData.Movie_positionX, 3)}</td>
                <td className="parameterKey">Y: {this.expo(this.props.movieData.Movie_positionX, 3)}</td>
              </tr>
            </tbody>
          </Table>
          <Table responsive size="sm">
            <tbody>
              <tr>
                <td className="parameterKey" colSpan="2">
                  <center>
                    <strong>Motion Correction</strong>
                  </center>
                </td>
              </tr>
              <tr>
                <td className="parameterKey">Total Motion:</td>
                <td className="parameterValue">{this.round(this.props.movieData.MotionCorrection_totalMotion, 0)}</td>
              </tr>
              <tr>
                <td className="parameterKey">Avg. Motion/frame</td>
                <td className="parameterValue">{this.props.movieData.MotionCorrection_averageMotionPerFrame}</td>
              </tr>
              <tr>
                <td className="parameterKey">Frame Range</td>
                <td className="parameterValue">
                  {this.props.movieData.MotionCorrection_firstFrame}-{this.props.movieData.MotionCorrection_lastFrame}
                </td>
              </tr>
              <tr>
                <td className="parameterKey">Dose</td>
                <td className="parameterValue">{this.props.movieData.MotionCorrection_dosePerFrame}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col xs={12} sm={2} md={2} lg={2}>
          <center>
            <strong>Motion Correction Drift</strong>
          </center>
          <ImageZoom
            image={{
              style: { width: '100%' },
              src: getMotionCorrectionDrift({
                proposalName: this.props.proposalName,
                dataCollectionId: this.props.movieData.Movie_dataCollectionId,
                movieId: this.props.movieData.Movie_movieId,
              }),
              onError: (a) => {
                a.target.src = '';
              },
            }}
          />
        </Col>
        <Col xs={12} sm={2} md={2} lg={2}>
          <center>
            <strong>Motion Corrected Micrograph</strong>
          </center>
          <ImageZoom
            image={{
              style: { width: '100%' },
              src: getMotionCorrectionThumbnail({
                proposalName: this.props.proposalName,
                dataCollectionId: this.props.movieData.Movie_dataCollectionId,
                movieId: this.props.movieData.Movie_movieId,
              }),
              onError: (a) => {
                a.target.src = '';
              },
            }}
          />
        </Col>
      </div>
    );
  }

  getCtfTable() {
    debugger;
    if (isNaN(this.props.movieData.CTF_resolutionLimit)) {
      return <div />;
    }
    return (
      <div>
        <Col xs={12} sm={2} md={2} lg={2}>
          <Table responsive size="sm">
            <tbody>
              <tr>
                <td className="parameterKey" colSpan="2">
                  <center>
                    <strong>CTF Results</strong>
                  </center>
                </td>
              </tr>
              <tr>
                <td className="parameterKey">Resolution Limit:</td>
                <td className="parameterValue">{this.round(this.props.movieData.CTF_resolutionLimit, 2)}</td>
              </tr>
              <tr>
                <td className="parameterKey">Correlation:</td>
                <td className="parameterValue">{this.round(this.props.movieData.CTF_crossCorrelationCoefficient, 3)}</td>
              </tr>
              <tr>
                <td className="parameterKey">Defocus U:</td>
                <td className="parameterValue">{this.round(this.props.movieData.CTF_defocusU, 0)}</td>
              </tr>
              <tr>
                <td className="parameterKey">Defocus V:</td>
                <td className="parameterValue">{this.round(this.props.movieData.CTF_defocusV, 0)}</td>
              </tr>
              <tr>
                <td className="parameterKey">Angle:</td>
                <td className="parameterValue">{this.round(this.props.movieData.CTF_angle, 2)}</td>
              </tr>
              <tr>
                <td className="parameterKey">Estimated B factor:</td>
                <td className="parameterValue">{this.round(this.props.movieData.CTF_estimatedBfactor, 2)}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col xs={12} sm={2} md={2} lg={2}>
          <center>
            <strong>CTF</strong>
          </center>
          <ImageZoom
            image={{
              style: { width: '100%' },
              src: getCTFThumbnail({
                proposalName: this.props.proposalName,
                dataCollectionId: this.props.movieData.Movie_dataCollectionId,
                movieId: this.props.movieData.Movie_movieId,
              }).url,
              onError: (a) => {
                a.target.src = '';
              },
            }}
          />
        </Col>
      </div>
    );
  }

  render() {
    return (
      <div
        style={{
          borderLeft: '1px solid #f2f2f2',
          borderRight: '1px solid #f2f2f2',
          borderBottom: '1px solid #f2f2f2',
          borderRadius: '15px',
        }}
      >
        <Container fluid>
          <Row>
            {this.getDateTimeFilenameForSmallDevice()}
            {this.getInstrumentMicrograph()}
            {this.getPositionMotionCorrectionTable()}
            {this.getCtfTable()}
          </Row>
        </Container>
      </div>
    );
  }
}

MoviePanel.propTypes = {
  movieData: PropTypes.object,
  user: PropTypes.object,
  proposal: PropTypes.string,
  dataCollectionId: PropTypes.string,
};
