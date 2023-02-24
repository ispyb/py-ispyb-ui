import { Row, Col, Alert } from 'react-bootstrap';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import {
  getDiffrationThumbnail,
  getCrystalImage,
  getDozorPlot,
} from 'legacy/api/ispyb';
import ZoomImage, { ZoomImageIcat } from 'legacy/components/image/zoomimage';
import FirstSection from 'legacy/pages/mx/datacollectiongroup/summarydatacollectiongroup/firstsection';
import ThirdSection from 'legacy/pages/mx/datacollectiongroup/summarydatacollectiongroup/thirdsection';
import UI from 'legacy/config/ui';
import {
  ResultRankParam,
  ResultRankShell,
} from 'legacy/helpers/mx/results/resultparser';
import { PhasingSummary } from '../mr/phasingSummary';
import { Dataset, getNotes } from 'legacy/hooks/icatmodel';
import { useSubDatasets } from 'legacy/hooks/icat';

export interface Props {
  proposalName: string;
  dataCollectionGroup: Dataset;
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
  const dcg = getNotes<DataCollectionGroup>(dataCollectionGroup);

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
        <PhasingSummary
          compact={compact}
          dataCollectionGroup={dataCollectionGroup}
          proposalName={proposalName}
        ></PhasingSummary>
        {!compact && (
          <Col xs={12} sm={6} md={true}>
            <ZoomImageIcat
              style={{ maxWidth: 300 }}
              alt="Diffraction"
              dataset={dataCollectionGroup}
              index={0}
            ></ZoomImageIcat>
          </Col>
        )}
        {!compact && (
          <Col xs={12} sm={6} md={true}>
            <ZoomImageIcat
              style={{ maxWidth: 300 }}
              alt="Diffraction"
              dataset={dataCollectionGroup}
              index={1}
            ></ZoomImageIcat>
          </Col>
        )}
        {UI.MX.showQualityIndicatorPlot && (
          <Col xs={12} sm={6} md={true}>
            <ZoomImageIcat
              style={{ maxWidth: 300 }}
              alt="Diffraction"
              dataset={dataCollectionGroup}
              index={2}
            ></ZoomImageIcat>
          </Col>
        )}
      </Row>
      {dcg.SpaceGroupModelResolvedByMr && (
        <Alert variant="success" className={'mt-3'}>
          Automatic MR appears to have worked with the space group{' '}
          {dcg.SpaceGroupModelResolvedByMr}
        </Alert>
      )}
      {dcg.SpaceGroupModelResolvedByPhasing && (
        <Alert variant="success" className={'mt-3'}>
          Automatic SAD appears to have worked with the space group{' '}
          {dcg.SpaceGroupModelResolvedByPhasing}
        </Alert>
      )}
      {!compact && (
        <Row>
          <h6>Comments</h6>
          <p>{dcg.DataCollectionGroup_comments}</p>
        </Row>
      )}
    </>
  );
}
