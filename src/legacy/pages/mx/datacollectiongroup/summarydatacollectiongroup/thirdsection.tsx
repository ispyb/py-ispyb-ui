import React from 'react';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import ScreeningSection from './screeningsection';
import AutoprocIntegrationSection from './autoprocintegrationsection';
import { getBestResult } from 'legacy/helpers/mx/resultparser';

export default function ThirdSection({
  dataCollectionGroup,
  compact = false,
}: {
  dataCollectionGroup: DataCollectionGroup;
  compact?: boolean;
}) {
  const bestResult = getBestResult(dataCollectionGroup);

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
