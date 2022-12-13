import { DataCollectionGroup } from 'legacy/pages/mx/model';
import ScreeningSection from './screeningsection';
import AutoprocIntegrationSection from './autoprocintegrationsection';
import { AutoProcIntegration } from 'legacy/helpers/mx/resultparser2';

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
      <AutoprocIntegrationSection
        compact={compact}
        bestResult={bestResult}
      ></AutoprocIntegrationSection>
    );
  }
  return (
    <ScreeningSection
      compact={compact}
      dataCollectionGroup={dataCollectionGroup}
    ></ScreeningSection>
  );
}
