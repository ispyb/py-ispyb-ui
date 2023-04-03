import { DataCollectionGroup } from 'legacy/pages/mx/model';
import { ScreeningInfo } from './ScreeningInfo';
import { BestAutoprocResult } from './BestAutoprocResult';
import {
  getBestResult,
  ResultRankParam,
  ResultRankShell,
} from 'legacy/helpers/mx/results/resultparser';
import { useAutoProc } from 'legacy/hooks/ispyb';
import { Alert, Container } from 'react-bootstrap';
import { useMemo } from 'react';

export function ProcessingInfo({
  proposalName,
  dataCollectionGroup,
  selectedPipelines,
  resultRankShell,
  resultRankParam,
}: {
  proposalName: string;

  dataCollectionGroup: DataCollectionGroup;
  selectedPipelines: string[];
  resultRankShell: ResultRankShell;
  resultRankParam: ResultRankParam;
}) {
  const { data } = useAutoProc({
    proposalName,
    dataCollectionId:
      dataCollectionGroup.DataCollection_dataCollectionId.toString(),
  });

  const bestResultWithPipelineFilter = useMemo(
    () =>
      getBestResult(
        (data || []).flatMap((d) => d),
        resultRankShell,
        resultRankParam,
        selectedPipelines
      ),
    [data, resultRankParam, resultRankShell, selectedPipelines]
  );

  const bestResultNoPipelineFilter = useMemo(
    () =>
      getBestResult(
        (data || []).flatMap((d) => d),
        resultRankShell,
        resultRankParam,
        []
      ),
    [data, resultRankParam, resultRankShell]
  );

  if (
    bestResultWithPipelineFilter === undefined &&
    bestResultNoPipelineFilter === undefined
  )
    return null;

  if (bestResultWithPipelineFilter) {
    return (
      <Container fluid>
        <BestAutoprocResult
          bestResult={bestResultWithPipelineFilter}
        ></BestAutoprocResult>
      </Container>
    );
  }
  if (bestResultNoPipelineFilter) {
    return (
      <Container fluid>
        <Alert variant="light">
          A result is available with pipeline{' '}
          <strong>
            <i>{bestResultNoPipelineFilter.program}</i>
          </strong>{' '}
          which is filtered out.
        </Alert>
      </Container>
    );
  }
  return (
    <Container fluid>
      <ScreeningInfo dataCollectionGroup={dataCollectionGroup}></ScreeningInfo>
    </Container>
  );
}
