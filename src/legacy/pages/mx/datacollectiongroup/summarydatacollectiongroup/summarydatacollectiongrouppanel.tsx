import { Row, Col, Alert } from 'react-bootstrap';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import {
  getDiffrationThumbnail,
  getCrystalImage,
  getDozorPlot,
} from 'legacy/api/ispyb';
import ZoomImage from 'legacy/components/image/zoomimage';
import FirstSection from 'legacy/pages/mx/datacollectiongroup/summarydatacollectiongroup/firstsection';
import ThirdSection from 'legacy/pages/mx/datacollectiongroup/summarydatacollectiongroup/thirdsection';
import UI from 'legacy/config/ui';
import {
  ResultRankParam,
  ResultRankShell,
} from 'legacy/helpers/mx/results/resultparser';
import { PhasingSummary } from '../mr/phasingSummary';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
  compact: boolean;
  selectedPipelines: string[];
  resultRankShell: ResultRankShell;
  resultRankParam: ResultRankParam;
}

export default function SummaryDataCollectionGroupPanel({
  proposalName,
  dataCollectionGroup,
  compact,
  selectedPipelines,
  resultRankShell,
  resultRankParam,
}: Props) {
  return (
    <>
      <Row>
        <Col xs={12} md={6} xl={4} xxl={3}>
          <FirstSection
            compact={compact}
            dataCollectionGroup={dataCollectionGroup}
          ></FirstSection>
        </Col>
        <Col sm={12} md={6} xl={compact ? 4 : 4} xxl={compact ? 4 : 3}>
          <ThirdSection
            compact={compact}
            dataCollectionGroup={dataCollectionGroup}
            selectedPipelines={selectedPipelines}
            resultRankShell={resultRankShell}
            resultRankParam={resultRankParam}
            proposalName={proposalName}
          ></ThirdSection>
        </Col>
        {dataCollectionGroup.hasMR ? (
          <Col sm={12} md={6} xl={compact ? 4 : 4} xxl={compact ? 4 : 3}>
            <PhasingSummary
              compact={compact}
              dataCollectionGroup={dataCollectionGroup}
              proposalName={proposalName}
            ></PhasingSummary>
          </Col>
        ) : null}
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
      {dataCollectionGroup.SpaceGroupModelResolvedByMr && (
        <Alert variant="success" className={'mt-3'}>
          Automatic MR appears to have worked with the space group{' '}
          {dataCollectionGroup.SpaceGroupModelResolvedByMr}
        </Alert>
      )}
      {dataCollectionGroup.SpaceGroupModelResolvedByPhasing && (
        <Alert variant="success" className={'mt-3'}>
          Automatic SAD appears to have worked with the space group{' '}
          {dataCollectionGroup.SpaceGroupModelResolvedByPhasing}
        </Alert>
      )}
      {!compact && (
        <Row>
          <h6>Comments</h6>
          <p>{dataCollectionGroup.DataCollectionGroup_comments}</p>
        </Row>
      )}
    </>
  );
}
