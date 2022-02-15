import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DataCollectionGroup } from 'pages/mx/model';
import FirstSection from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/firstsection';
import SecondSection from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/secondsection';
import ThirdSection from './thirdsection';
import FourthSection from './fourthsection';
import FifthSection from './fifthsection';
import SixthSection from './sixthsection';

export interface Props {
  dataCollectionGroup: DataCollectionGroup;
}

export default function BeamlineDataCollectionGroupPanel({ dataCollectionGroup }: Props) {
  return (
    <Container fluid>
      <Row>
        <Col>
          <FirstSection dataCollectionGroup={dataCollectionGroup}></FirstSection>
        </Col>
        <Col>
          <SecondSection dataCollectionGroup={dataCollectionGroup}></SecondSection>
        </Col>
        <Col>
          <ThirdSection dataCollectionGroup={dataCollectionGroup}></ThirdSection>
        </Col>
        <Col>
          <FourthSection dataCollectionGroup={dataCollectionGroup}></FourthSection>
        </Col>
        <Col>
          <FifthSection dataCollectionGroup={dataCollectionGroup}></FifthSection>
        </Col>
        <Col>
          <SixthSection dataCollectionGroup={dataCollectionGroup}></SixthSection>
        </Col>
      </Row>
    </Container>
  );
}
