import React from 'react';
import { DataCollectionGroup } from 'pages/mx/model';
import ScreeningSection from './screeningsection';
import AutoprocIntegrationSection from './autoprocintegrationsection';
import { getBestResult } from 'helpers/mx/resultparser';

export default function ThirdSection({ dataCollectionGroup, compact = false }: { dataCollectionGroup: DataCollectionGroup; compact?: boolean }) {
  const bestResult = getBestResult(dataCollectionGroup);

  if (bestResult) {
    return <AutoprocIntegrationSection compact={compact} bestResult={bestResult}></AutoprocIntegrationSection>;
  }
  return <ScreeningSection compact={compact} dataCollectionGroup={dataCollectionGroup}></ScreeningSection>;
}
