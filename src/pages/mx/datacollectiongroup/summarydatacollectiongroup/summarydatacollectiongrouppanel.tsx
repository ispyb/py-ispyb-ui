import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DataCollectionGroup } from 'pages/mx/model';
import { getDiffrationThumbnail, getCrystalImage, getDozorPlot } from 'api/ispyb';
import ZoomImage from 'components/image/zoomimage';
import FirstSection from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/firstsection';
import SecondSection from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/secondsection';
import ThirdSection from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/thirdsection';
import UI from 'config/ui';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
  compact: boolean;
}

export default function SummaryDataCollectionGroupPanel({ proposalName, dataCollectionGroup, compact }: Props) {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} sm={6} md={'auto'}>
          <FirstSection compact={compact} dataCollectionGroup={dataCollectionGroup}></FirstSection>
        </Col>
        <Col xs={12} sm={6} md={'auto'}>
          <SecondSection compact={compact} dataCollectionGroup={dataCollectionGroup}></SecondSection>
        </Col>
        <Col xs={12} sm={12} md={'auto'}>
          <ThirdSection compact={compact} dataCollectionGroup={dataCollectionGroup}></ThirdSection>
        </Col>
        {!compact && (
          <Col xs={12} sm={6} md={true}>
            <ZoomImage alt="Diffraction" src={getDiffrationThumbnail({ proposalName, imageId: dataCollectionGroup.firstImageId }).url}></ZoomImage>
          </Col>
        )}
        {!compact && (
          <Col xs={12} sm={6} md={true}>
            <ZoomImage alt="Crystal" src={getCrystalImage({ proposalName, dataCollectionId: dataCollectionGroup.DataCollection_dataCollectionId, imageIndex: 1 }).url}></ZoomImage>
          </Col>
        )}
        {UI.MX.showQualityIndicatorPlot && (
          <Col xs={12} sm={6} md={true}>
            <ZoomImage
              style={compact ? { maxWidth: 150 } : undefined}
              alt="Dozor"
              src={getDozorPlot({ proposalName, dataCollectionId: dataCollectionGroup.DataCollection_dataCollectionId }).url}
            ></ZoomImage>
          </Col>
        )}
      </Row>
      {!compact && (
        <Row>
          <h6>Comments</h6>
          <p>{dataCollectionGroup.DataCollectionGroup_comments}</p>
        </Row>
      )}
    </Container>
  );
}
