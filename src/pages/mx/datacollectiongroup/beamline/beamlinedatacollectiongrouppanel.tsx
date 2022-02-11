import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DataCollectionGroup } from 'pages/mx/model';
import FirstSection from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/firstsection';
import SecondSection from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/secondsection';

export interface Props {
  dataCollectionGroup: DataCollectionGroup;
}

export default function BeamlineDataCollectionGroupPanel({ dataCollectionGroup }: Props) {
  return (
    <Container fluid>
      <Row>
        <Col sm={12} md={2}>
          <FirstSection dataCollectionGroup={dataCollectionGroup}></FirstSection>
        </Col>
        <Col>
          <SecondSection dataCollectionGroup={dataCollectionGroup}></SecondSection>
        </Col>
        <Col>To be implemented</Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
