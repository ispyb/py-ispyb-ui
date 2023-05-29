import { Alert, Col, Container, Row } from 'react-bootstrap';
import { StatisticsPlotData } from 'legacy/pages/em/model';
import PlotWidget from 'components/Plotting/plotwidget';
import { Suspense, useMemo, useState } from 'react';
import { useMoviesByDataCollectionId } from 'legacy/hooks/ispyb';
import { MovieCard } from './movie/moviepanel';
import { createImageNumberAndFileName } from './movie/helper';
import Loading from 'components/Loading';

export default function EmStatisticsPanel({
  statisticsPlotData,
  proposalName,
}: {
  statisticsPlotData: StatisticsPlotData;
  proposalName: string;
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
    movieId,
    collectionId,
  } = statisticsPlotData;

  const [showMovieIndex, setShowMovieIndex] = useState<number | undefined>(
    undefined
  );

  const [showMovieId, showMovieDataCollectionId] = useMemo(() => {
    if (showMovieIndex !== undefined) {
      return [movieId[showMovieIndex], collectionId[showMovieIndex]];
    }
    return [undefined, undefined];
  }, [showMovieIndex, movieId, collectionId]);

  const handleMovieStatClick = (e: any) => {
    if ('points' in e) {
      const point = e.points[0];
      const movieIndex = point.pointIndex;
      setShowMovieIndex(movieIndex);
    }
  };

  const getSelectedPoint = (y: number[]): any[] => {
    if (showMovieIndex === undefined) return [];
    else
      return [
        {
          x: [movieNumber[showMovieIndex]],
          y: [y[showMovieIndex]],
          type: 'scattergl',
          mode: 'markers',
          marker: {
            color: '#d754ff',
            size: 10,
            line: {
              color: 'black',
              width: 2,
            },
          },
          showlegend: false,
        },
      ];
  };

  const colProps: any = {
    xs: 12,
    lg: 6,
    xxl: 4,
    style: {
      display: 'inline-block',
      float: 'none',
      maxWidth: 500,
    },
  };

  return (
    <Container fluid>
      <Row
        style={{
          display: 'block',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          backgroundColor: '#f5f5f5',
          padding: 10,
          border: '1px solid gray',
          margin: 5,
          marginTop: 15,
        }}
      >
        <Col {...colProps}>
          <PlotWidget
            data={[
              {
                x: movieNumber,
                y: resolution,
                type: 'scattergl',
                mode: 'markers',
                marker: { color: 'blue', size: 4 },
                name: 'resolution',
              },
              ...getSelectedPoint(resolution),
            ]}
            useResizeHandler
            style={{ width: '100%' }}
            layout={{
              xaxis: { title: { text: 'Image no' } },
              yaxis: { title: { text: 'Angstroms' } },
              autosize: true,
              title: 'Resolution',
              showlegend: false,
            }}
            onClick={handleMovieStatClick}
            compact
          />
        </Col>
        <Col {...colProps}>
          <PlotWidget
            data={[
              {
                x: movieNumber,
                y: angle,
                type: 'scattergl',
                mode: 'markers',
                marker: { color: 'blue', size: 4 },
                name: 'angle',
              },
              ...getSelectedPoint(angle),
            ]}
            useResizeHandler
            style={{ width: '100%' }}
            layout={{
              xaxis: { title: { text: 'Image no' } },
              yaxis: { title: { text: 'Degrees' } },
              autosize: true,
              title: 'Astigmatism (angle)',
              showlegend: false,
            }}
            onClick={handleMovieStatClick}
            compact
          />
        </Col>
        <Col {...colProps}>
          <PlotWidget
            data={[
              {
                x: movieNumber,
                y: defocusU,
                name: 'Defocus U',
                type: 'scattergl',
                mode: 'markers',
                marker: { color: 'blue', size: 4 },
              },
              ...getSelectedPoint(defocusU),
              {
                x: movieNumber,
                y: defocusV,
                name: 'Defocus V',
                type: 'scattergl',
                mode: 'markers',
                marker: { color: 'red', size: 4 },
              },
              ...getSelectedPoint(defocusV),
            ]}
            useResizeHandler
            style={{ width: '100%' }}
            layout={{
              xaxis: { title: { text: 'Image no' } },
              yaxis: { title: { text: 'Microns' } },
              autosize: true,
              title: { text: 'Defocus U and Defocus V' },
            }}
            onClick={handleMovieStatClick}
            compact
          />
        </Col>
        <Col {...colProps}>
          <PlotWidget
            data={[
              {
                x: movieNumber,
                y: defocusDifference,
                type: 'scattergl',
                mode: 'markers',
                marker: { color: 'blue', size: 4 },
                name: 'defocus',
              },
              ...getSelectedPoint(defocusDifference),
            ]}
            useResizeHandler
            style={{ width: '100%' }}
            layout={{
              xaxis: { title: { text: 'Image no' } },
              yaxis: { title: { text: 'Microns' } },
              autosize: true,
              title: 'Defocus U - Defocus V',
              showlegend: false,
            }}
            onClick={handleMovieStatClick}
            compact
          />
        </Col>
        <Col {...colProps}>
          <PlotWidget
            data={[
              {
                x: movieNumber,
                y: averageData,
                type: 'scattergl',
                mode: 'markers',
                marker: { color: 'blue', size: 4 },
                name: 'motion',
              },
              ...getSelectedPoint(averageData),
            ]}
            useResizeHandler
            style={{ width: '100%' }}
            layout={{
              xaxis: { title: { text: 'Image no' } },
              autosize: true,
              title: 'Average motion per frame',
              showlegend: false,
            }}
            onClick={handleMovieStatClick}
            compact
          />
        </Col>
        <Col {...colProps}>
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
            compact
          />
        </Col>
        <Col {...colProps}>
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
            compact
          />
        </Col>

        <Col {...colProps}>
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
              barmode: 'group',
            }}
            compact
          />
        </Col>
      </Row>
      <Row>
        <Col
          style={{
            paddingTop: '1rem',
          }}
        >
          {showMovieId && showMovieDataCollectionId ? (
            <Suspense fallback={<Loading />}>
              <StatisticsMoviePanel
                collectionId={showMovieDataCollectionId}
                movieId={showMovieId}
                proposalName={proposalName}
              />
            </Suspense>
          ) : (
            <Alert variant="info">Click on point to see movie.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

function StatisticsMoviePanel({
  movieId,
  collectionId,
  proposalName,
}: {
  movieId: number;
  collectionId: number;
  proposalName: string;
}) {
  const { data: movies } = useMoviesByDataCollectionId({
    proposalName,
    dataCollectionId: collectionId,
  });

  const parsedMovies = useMemo(() => {
    if (movies) {
      return createImageNumberAndFileName(movies);
    }
    return undefined;
  }, [movies]);

  const movie = useMemo(() => {
    if (parsedMovies) {
      return parsedMovies.find((m) => m.Movie_movieId === movieId);
    }
    return undefined;
  }, [parsedMovies, movieId]);

  if (movie === undefined) return null;

  return (
    <Container fluid>
      <MovieCard
        movie={movie}
        proposalName={proposalName}
        dataCollectionId={collectionId}
      />
    </Container>
  );
}
