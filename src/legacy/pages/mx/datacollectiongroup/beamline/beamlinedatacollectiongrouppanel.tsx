import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import FirstSection from 'legacy/pages/mx/datacollectiongroup/summarydatacollectiongroup/firstsection';
import SecondSection from 'legacy/pages/mx/datacollectiongroup/summarydatacollectiongroup/secondsection';
import ThirdSection from './thirdsection';
import FourthSection from './fourthsection';
import FifthSection from './fifthsection';
import SixthSection from './sixthsection';

export interface Props {
  dataCollectionGroup: DataCollectionGroup;
}

export default function BeamlineDataCollectionGroupPanel({
  dataCollectionGroup,
}: Props) {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} sm={6} lg={4} xl={2}>
          <FirstSection
            dataCollectionGroup={dataCollectionGroup}
          ></FirstSection>
        </Col>
        <Col xs={12} sm={6} lg={4} xl={2}>
          <SecondSection
            dataCollectionGroup={dataCollectionGroup}
          ></SecondSection>
        </Col>
        <Col xs={12} sm={6} lg={4} xl={2}>
          <ThirdSection
            dataCollectionGroup={dataCollectionGroup}
          ></ThirdSection>
        </Col>
        <Col xs={12} sm={6} lg={4} xl={2}>
          <FourthSection
            dataCollectionGroup={dataCollectionGroup}
          ></FourthSection>
        </Col>
        <Col xs={12} sm={6} lg={4} xl={2}>
          <FifthSection
            dataCollectionGroup={dataCollectionGroup}
          ></FifthSection>
        </Col>
        <Col xs={12} sm={6} lg={4} xl={2}>
          <SixthSection
            dataCollectionGroup={dataCollectionGroup}
          ></SixthSection>
        </Col>
      </Row>
    </Container>
  );
}
