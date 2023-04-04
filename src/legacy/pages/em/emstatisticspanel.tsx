import { Col, Container, Row } from 'react-bootstrap';
import { StatisticsPlotData } from 'legacy/pages/em/model';
import PlotWidget from 'components/Plotting/plotwidget';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import Loading from 'components/Loading';

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
          <LazyWrapper placeholder={<Loading />}>
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
          </LazyWrapper>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6}>
          <LazyWrapper placeholder={<Loading />}>
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
          </LazyWrapper>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={6}>
          <LazyWrapper placeholder={<Loading />}>
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
          </LazyWrapper>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6}>
          <LazyWrapper placeholder={<Loading />}>
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
          </LazyWrapper>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={4}>
          <LazyWrapper placeholder={<Loading />}>
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
          </LazyWrapper>
        </Col>
        <Col xs={12} sm={12} md={12} lg={4}>
          <LazyWrapper placeholder={<Loading />}>
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
          </LazyWrapper>
        </Col>
        <Col xs={12} sm={12} md={12} lg={4}>
          <LazyWrapper placeholder={<Loading />}>
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
          </LazyWrapper>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <LazyWrapper placeholder={<Loading />}>
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
          </LazyWrapper>
        </Col>
      </Row>
    </Container>
  );
}
