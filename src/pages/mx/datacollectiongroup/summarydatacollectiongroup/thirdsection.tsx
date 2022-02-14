import React from 'react';
import { DataCollectionGroup } from 'pages/mx/model';
import ScreeningSection from './screeningsection';
import AutoprocIntegrationSection from './autoprocintegrationsection';
import { getBestResult } from 'helpers/mx/resultparser';

export default function ThirdSection({ dataCollectionGroup }: { dataCollectionGroup: DataCollectionGroup }) {
  const bestResult = getBestResult(dataCollectionGroup);

  if (bestResult) {
    return <AutoprocIntegrationSection bestResult={bestResult}></AutoprocIntegrationSection>;
  }
  return <ScreeningSection dataCollectionGroup={dataCollectionGroup}></ScreeningSection>;
}
