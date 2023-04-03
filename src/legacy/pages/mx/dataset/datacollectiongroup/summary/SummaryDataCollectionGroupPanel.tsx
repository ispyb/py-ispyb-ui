import { Row, Col, Alert, Container } from 'react-bootstrap';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import {
  getDiffrationThumbnail,
  getCrystalImage,
  getDozorPlot,
  getWorkflowImage,
  updateCollectionGroupComments,
} from 'legacy/api/ispyb';
import ZoomImage from 'legacy/components/image/zoomimage';

import UI from 'legacy/config/ui';
import {
  ResultRankParam,
  ResultRankShell,
} from 'legacy/helpers/mx/results/resultparser';
import { PhasingSummary } from '../phasing/phasingSummary';
import { CopyValue } from 'components/Common/CopyValue';
import _ from 'lodash';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import Loading from 'components/Loading';
import { ProcessingInfo } from './ProcessingInfo';
import { ParametersInfo } from './ParametersInfo';
import { useMemo } from 'react';
import { EditComments } from 'legacy/components/EditComments';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
  selectedPipelines: string[];
  resultRankShell: ResultRankShell;
  resultRankParam: ResultRankParam;
}

export function SummaryDataCollectionGroupPanel({
  proposalName,
  dataCollectionGroup,
  selectedPipelines,
  resultRankShell,
  resultRankParam,
}: Props) {
  const crystalSnapshotId = useMemo(() => {
    //look for crystal Snapshots in workflow steps
    const crystalSnapshots = _(
      dataCollectionGroup.WorkflowStep_workflowStepType?.split(',') || []
    )
      .zip(
        dataCollectionGroup.WorkflowStep_status?.split(',') || [],
        dataCollectionGroup.WorkflowStep_workflowStepId?.split(',') || []
      )
      .filter(
        ([stepType, status]) =>
          (stepType?.toLocaleLowerCase().includes('snapshot') &&
            status?.toLocaleLowerCase().includes('success')) ||
          false
      )
      .map(([, , stepId]) => stepId)
      .filter((stepId) => stepId !== undefined)
      .value() as string[];
    return crystalSnapshots.length > 0 ? crystalSnapshots[0] : undefined;
  }, [
    dataCollectionGroup.WorkflowStep_status,
    dataCollectionGroup.WorkflowStep_workflowStepId,
    dataCollectionGroup.WorkflowStep_workflowStepType,
  ]);

  return (
    <Container fluid>
      <Col>
        {dataCollectionGroup.DataCollection_imageDirectory && (
          <Row style={{ marginBottom: '1rem' }}>
            <Col
              xs={'auto'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              <strong>Path:</strong>
            </Col>
            <Col
              xs={'auto'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <CopyValue
                value={dataCollectionGroup.DataCollection_imageDirectory}
              />
            </Col>
          </Row>
        )}

        <Row>
          <Col xs={12} md={6} xl={4} xxl={3}>
            <ParametersInfo
              dataCollectionGroup={dataCollectionGroup}
            ></ParametersInfo>
          </Col>
          {(dataCollectionGroup.autoProcIds || '').trim().length > 0 ? (
            <Col sm={12} md={6} xl={4} xxl={3}>
              <LazyWrapper height={430} placeholder={<Loading />}>
                <ProcessingInfo
                  dataCollectionGroup={dataCollectionGroup}
                  selectedPipelines={selectedPipelines}
                  resultRankShell={resultRankShell}
                  resultRankParam={resultRankParam}
                  proposalName={proposalName}
                ></ProcessingInfo>
              </LazyWrapper>
            </Col>
          ) : null}
          {!!dataCollectionGroup.hasMR || !!dataCollectionGroup.hasPhasing ? (
            <Col sm={12} md={6} xl={4} xxl={3}>
              <LazyWrapper height={430} placeholder={<Loading />}>
                <PhasingSummary
                  dataCollectionGroup={dataCollectionGroup}
                  proposalName={proposalName}
                ></PhasingSummary>
              </LazyWrapper>
            </Col>
          ) : null}

          <Col xs={12} md={12} lg={true}>
            <Row>
              <Col style={{ paddingTop: 5 }}>
                <ZoomImage
                  style={{ maxWidth: 300, minWidth: 150 }}
                  alt="Diffraction"
                  src={
                    getDiffrationThumbnail({
                      proposalName,
                      imageId: dataCollectionGroup.firstImageId,
                    }).url
                  }
                ></ZoomImage>
              </Col>
              <Col style={{ paddingTop: 5 }}>
                <ZoomImage
                  style={{ maxWidth: 300, minWidth: 150 }}
                  alt="Crystal"
                  src={
                    crystalSnapshotId
                      ? getWorkflowImage({
                          proposalName,
                          stepId: crystalSnapshotId,
                        }).url
                      : getCrystalImage({
                          proposalName,
                          dataCollectionId:
                            dataCollectionGroup.DataCollection_dataCollectionId,
                          imageIndex: 1,
                        }).url
                  }
                ></ZoomImage>
              </Col>
              {UI.MX.showQualityIndicatorPlot && (
                <Col style={{ paddingTop: 5 }}>
                  <ZoomImage
                    style={{ maxWidth: 300, minWidth: 150 }}
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
          </Col>
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
        <Row>
          <EditComments
            comments={dataCollectionGroup.DataCollectionGroup_comments || ''}
            proposalName={proposalName}
            id={
              dataCollectionGroup.DataCollectionGroup_dataCollectionGroupId?.toString() ||
              ''
            }
            saveReq={updateCollectionGroupComments}
          />
        </Row>
      </Col>
    </Container>
  );
}
