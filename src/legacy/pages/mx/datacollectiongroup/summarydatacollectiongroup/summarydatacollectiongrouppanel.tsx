import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import {
  getDiffrationThumbnail,
  getCrystalImage,
  getDozorPlot,
} from 'legacy/api/ispyb';
import ZoomImage from 'legacy/components/image/zoomimage';
import FirstSection from 'legacy/pages/mx/datacollectiongroup/summarydatacollectiongroup/firstsection';
import SecondSection from 'legacy/pages/mx/datacollectiongroup/summarydatacollectiongroup/secondsection';
import ThirdSection from 'legacy/pages/mx/datacollectiongroup/summarydatacollectiongroup/thirdsection';
import UI from 'legacy/config/ui';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
  compact: boolean;
}

export default function SummaryDataCollectionGroupPanel({
  proposalName,
  dataCollectionGroup,
  compact,
}: Props) {
  return (
    <>
      <Row>
        <Col xs={12} sm={6} md={3}>
          <FirstSection
            compact={compact}
            dataCollectionGroup={dataCollectionGroup}
          ></FirstSection>
        </Col>
        <Col xs={12} sm={6} md={2}>
          <SecondSection
            compact={compact}
            dataCollectionGroup={dataCollectionGroup}
          ></SecondSection>
        </Col>
        <Col xs={12} sm={12} md={compact ? 6 : 2}>
          <ThirdSection
            compact={compact}
            dataCollectionGroup={dataCollectionGroup}
          ></ThirdSection>
        </Col>
        {!compact && (
          <Col xs={12} sm={6} md={true}>
            <ZoomImage
              style={{ maxWidth: 300 }}
              alt="Diffraction"
              src={
                getDiffrationThumbnail({
                  proposalName,
                  imageId: dataCollectionGroup.firstImageId,
                }).url
              }
            ></ZoomImage>
          </Col>
        )}
        {!compact && (
          <Col xs={12} sm={6} md={true}>
            <ZoomImage
              style={{ maxWidth: 300 }}
              alt="Crystal"
              src={
                getCrystalImage({
                  proposalName,
                  dataCollectionId:
                    dataCollectionGroup.DataCollection_dataCollectionId,
                  imageIndex: 1,
                }).url
              }
            ></ZoomImage>
          </Col>
        )}
        {UI.MX.showQualityIndicatorPlot && (
          <Col xs={12} sm={6} md={true}>
            <ZoomImage
              style={compact ? { maxWidth: 150 } : { maxWidth: 300 }}
              alt="Dozor"
              src={
                getDozorPlot({
                  proposalName,
                  dataCollectionId:
                    dataCollectionGroup.DataCollection_dataCollectionId,
                }).url
              }
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
    </>
  );
}
