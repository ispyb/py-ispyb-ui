import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PlotWidget from 'legacy/components/plotting/plotwidget';
import { StatisticsPlotData } from 'legacy/pages/em/model';

export default function EmStatisticsPanel({
  statisticsPlotData,
}: {
  statisticsPlotData: StatisticsPlotData;
}) {
  const {
    movieNumber,
    defocusUDistribution,
    averageData,
    defocusVDistribution,
    resolution,
    resolutionDistribution,
    angle,
    angleDistribution,
    defocusU,
    defocusV,
    defocusDifference,
  } = statisticsPlotData;

  return (
    <Container>
      <Row>
        <Col xs={12} sm={12} md={12} lg={6}>
          <PlotWidget
            data={[
              {
                x: movieNumber,
                y: resolution,
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
                x: resolutionDistribution.map(function (value) {
                  return value[0];
                }),
                y: resolutionDistribution.map(function (value) {
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
                x: movieNumber,
                y: angle,
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
                x: angleDistribution.map(function (value) {
                  return value[0];
                }),
                y: angleDistribution.map(function (value) {
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
                x: movieNumber,
                y: defocusU,
                name: 'Defocus U',
                type: 'scatter',
                mode: 'markers',
                marker: { color: 'blue', size: 4 },
              },
              {
                x: movieNumber,
                y: defocusV,
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
                x: movieNumber,
                y: defocusDifference,
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
                x: defocusUDistribution.map(function (value) {
                  return value[0];
                }),
                y: defocusUDistribution.map(function (value) {
                  return value[1];
                }),
                name: 'Defocus U',
                type: 'bar',
                marker: { color: 'blue', size: 4 },
              },
              {
                x: defocusVDistribution.map(function (value) {
                  return value[0];
                }),
                y: defocusVDistribution.map(function (value) {
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
                x: movieNumber,
                y: averageData,
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
