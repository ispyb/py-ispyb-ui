import {
  AutoProcInformation,
  DataCollectionGroup,
} from 'legacy/pages/mx/model';
import ScreeningSection from './screeningsection';
import BestResultSection from './autoprocintegrationsection';
import {
  getBestResult,
  ResultRankParam,
  ResultRankShell,
} from 'legacy/helpers/mx/results/resultparser';
import { useAutoProc } from 'legacy/hooks/ispyb';
import { Alert } from 'react-bootstrap';
import { Dataset, getNotes } from 'legacy/hooks/icatmodel';
import { useSubDatasets } from 'legacy/hooks/icat';

export default function ThirdSection({
  proposalName,
  dataCollectionGroup,
  compact,
  selectedPipelines,
  resultRankShell,
  resultRankParam,
}: {
  proposalName: string;

  dataCollectionGroup: Dataset;
  compact: boolean;
  selectedPipelines: string[];
  resultRankShell: ResultRankShell;
  resultRankParam: ResultRankParam;
}) {
  const { data: autoprocintegrations } = useSubDatasets({
    dataset: dataCollectionGroup,
    type: 'autoprocintegration',
  });
  const data = autoprocintegrations.map(getNotes<AutoProcInformation>);
  if (!data || !data.length) return null;

  const bestResultWithPipelineFilter = getBestResult(
    data,
    resultRankShell,
    resultRankParam,
    selectedPipelines
  );

  const bestResultNoPipelineFilter = getBestResult(
    data,
    resultRankShell,
    resultRankParam,
    []
  );

  if (bestResultWithPipelineFilter) {
    return (
      <BestResultSection
        compact={compact}
        bestResult={bestResultWithPipelineFilter}
      ></BestResultSection>
    );
  }
  if (bestResultNoPipelineFilter) {
    return (
      <Alert variant="light">
        A result is available with pipeline{' '}
        <strong>
          <i>{bestResultNoPipelineFilter.program}</i>
        </strong>{' '}
        which is filtered out.
      </Alert>
    );
  }
  return (
    <ScreeningSection
      compact={compact}
      dataCollectionGroup={getNotes<DataCollectionGroup>(dataCollectionGroup)}
    ></ScreeningSection>
  );
}
