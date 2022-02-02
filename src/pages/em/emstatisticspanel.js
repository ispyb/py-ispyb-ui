import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PlotWidget from 'components/plotting/plotwidget';

export default class EmStatisticsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.statisticsPlotData;
  }

  render() {
    return (
      <Container>
        <Row>
          <Col xs={12} sm={12} md={12} lg={6}>
            <PlotWidget
              data={[
                {
                  x: this.state.movieNumber,
                  y: this.state.resolution,
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: 'blue', size: 4 },
                },
              ]}
              useResizeHandler
              style={{ width: '100%' }}
              layout={{
                xaxis: { title: { text: 'Image no' } },
                yaxis: { title: { text: 'Angstroms' } },
                autosize: true,
                title: 'Resolution',
              }}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={6}>
            <PlotWidget
              data={[
                {
                  x: this.state.resolutionDistribution.map(function (value) {
                    return value[0];
                  }),
                  y: this.state.resolutionDistribution.map(function (value) {
                    return value[1];
                  }),
                  type: 'bar',
                  marker: { color: 'blue', size: 4 },
                },
              ]}
              useResizeHandler
              style={{ width: '100%' }}
              layout={{
                xaxis: { title: { text: 'Angstroms' } },
                autosize: true,
                title: 'Resolution distribution',
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={6}>
            <PlotWidget
              data={[
                {
                  x: this.state.movieNumber,
                  y: this.state.angle,
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: 'blue', size: 4 },
                },
              ]}
              useResizeHandler
              style={{ width: '100%' }}
              layout={{
                xaxis: { title: { text: 'Image no' } },
                yaxis: { title: { text: 'Degrees' } },
                autosize: true,
                title: 'Astigmatism (angle)',
              }}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={6}>
            <PlotWidget
              data={[
                {
                  x: this.state.angleDistribution.map(function (value) {
                    return value[0];
                  }),
                  y: this.state.angleDistribution.map(function (value) {
                    return value[1];
                  }),
                  type: 'bar',
                  marker: { color: 'blue', size: 4 },
                },
              ]}
              useResizeHandler
              style={{ width: '100%' }}
              layout={{
                xaxis: { title: { text: 'Degrees' } },
                autosize: true,
                title: 'Astigmatism (angle) distribution',
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={4}>
            <PlotWidget
              data={[
                {
                  x: this.state.movieNumber,
                  y: this.state.defocusU,
                  name: 'Defocus U',
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: 'blue', size: 4 },
                },
                {
                  x: this.state.movieNumber,
                  y: this.state.defocusV,
                  name: 'Defocus V',
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: 'red', size: 4 },
                },
              ]}
              useResizeHandler
              style={{ width: '100%' }}
              layout={{
                xaxis: { title: { text: 'Image no' } },
                yaxis: { title: { text: 'Microns' } },
                autosize: true,
                title: { text: 'Defocus U and Defocus V' },
              }}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={4}>
            <PlotWidget
              data={[
                {
                  x: this.state.movieNumber,
                  y: this.state.defocusDifference,
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: 'blue', size: 4 },
                },
              ]}
              useResizeHandler
              style={{ width: '100%' }}
              layout={{
                xaxis: { title: { text: 'Image no' } },
                yaxis: { title: { text: 'Microns' } },
                autosize: true,
                title: 'Defocus U - Defocus V',
              }}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={4}>
            <PlotWidget
              data={[
                {
                  x: this.state.defocusUDistribution.map(function (value) {
                    return value[0];
                  }),
                  y: this.state.defocusUDistribution.map(function (value) {
                    return value[1];
                  }),
                  name: 'Defocus U',
                  type: 'bar',
                  marker: { color: 'blue', size: 4 },
                },
                {
                  x: this.state.defocusVDistribution.map(function (value) {
                    return value[0];
                  }),
                  y: this.state.defocusVDistribution.map(function (value) {
                    return value[1];
                  }),
                  name: 'Defocus V',
                  type: 'bar',
                  marker: { color: 'red', size: 4 },
                },
              ]}
              useResizeHandler
              style={{ width: '100%' }}
              layout={{
                xaxis: { title: { text: 'Microns' } },
                autosize: true,
                title: 'Defocus distribution',
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <PlotWidget
              data={[
                {
                  x: this.state.movieNumber,
                  y: this.state.averageData,
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: 'blue', size: 4 },
                },
              ]}
              useResizeHandler
              style={{ width: '100%' }}
              layout={{
                xaxis: { title: { text: 'Image no' } },
                autosize: true,
                title: 'Average motion per frame',
              }}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
