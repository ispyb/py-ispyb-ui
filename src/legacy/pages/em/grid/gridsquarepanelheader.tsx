import { Col, Container, Row } from 'react-bootstrap';
import React from 'react';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import 'react-medium-image-zoom/dist/styles.css';
import { SampleList } from 'legacy/pages/em/model';

export default function GridSquarePanelHeader({
  sampleList,
}: {
  sampleList: SampleList;
}) {
  const {
    samplingRate,
    sampleName,
    gridSquaresCount,
    magnification,
    noFrames,
    totalNumberOfMovies,
    voltage,
  } = sampleList;
  return (
    <div>
      <h3>Sample name : {sampleName}</h3>
      <Container fluid style={{ marginTop: '5px' }}>
        <Row>
          <Col xs={12} sm={3} md={3} lg={3}>
            <SimpleParameterTable
              parameters={[
                { key: 'Total number of movies', value: totalNumberOfMovies },
                { key: 'Magnification', value: magnification },
              ]}
            />
          </Col>
          <Col xs={12} sm={3} md={3} lg={3}>
            <SimpleParameterTable
              parameters={[
                { key: 'Grid Squares', value: gridSquaresCount },
                { key: '# Frames', value: noFrames },
              ]}
            />
          </Col>
          <Col xs={12} sm={3} md={3} lg={3}>
            <SimpleParameterTable
              parameters={[
                { key: 'Voltage', value: `${voltage} V` },
                { key: 'Spherical Aberation', value: '2.7 mm' },
              ]}
            />
          </Col>
          <Col xs={12} sm={3} md={3} lg={3}>
            <SimpleParameterTable
              parameters={[
                { key: 'Amplitude Contrast', value: '10 %' },
                { key: 'Sampling Rate', value: `${samplingRate} Å/pixel` },
              ]}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
