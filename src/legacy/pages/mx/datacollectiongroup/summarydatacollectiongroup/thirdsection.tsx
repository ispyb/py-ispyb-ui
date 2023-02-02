import { DataCollectionGroup } from 'legacy/pages/mx/model';
import ScreeningSection from './screeningsection';
import BestResultSection from './autoprocintegrationsection';
import { AutoProcIntegration } from 'legacy/helpers/mx/results/resultparser';

export default function ThirdSection({
  dataCollectionGroup,
  compact = false,
  bestResult,
}: {
  dataCollectionGroup: DataCollectionGroup;
  compact?: boolean;
  bestResult?: AutoProcIntegration;
}) {
  if (bestResult) {
    return (
      <BestResultSection
        compact={compact}
        bestResult={bestResult}
      ></BestResultSection>
    );
  }
  return (
    <ScreeningSection
      compact={compact}
      dataCollectionGroup={dataCollectionGroup}
    ></ScreeningSection>
  );
}
