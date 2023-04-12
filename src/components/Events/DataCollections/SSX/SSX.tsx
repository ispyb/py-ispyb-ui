import { Placeholder, Tab } from 'react-bootstrap';

import { EventResource } from 'api/resources/Event';
import { useSuspense } from 'rest-hooks';
import { IDataCollection } from '../Default';
import { DataCollectionBox } from '../../DataCollection';
import { Suspense, useState } from 'react';
import { CompactSSXContent } from './SSXCompact';
import { SampleResource } from 'api/resources/Sample';
import { ExpandedSSXContent } from './SSXExpanded';
import Loading from 'components/Loading';
import { usePersistentParamState } from 'hooks/useParam';

export default function SSX(props: IDataCollection) {
  return (
    <Suspense fallback={<LoadingSSXDataCollectionGroup />}>
      <SSXDataCollectionGroup {...props} />
    </Suspense>
  );
}

function LoadingSSXDataCollectionGroup() {
  return (
    <>
      <div className="event-header ">
        <h3 className="text-white rounded p-3 mb-3">
          <Placeholder xs={1}></Placeholder>
        </h3>
      </div>
      <Loading />
    </>
  );
}

export function SSXDataCollectionGroup(props: IDataCollection) {
  const { item, parent } = props;
  const dataCollectionGroupId = item.DataCollectionGroup.dataCollectionGroupId;
  const dcs = useSuspense(EventResource.getList, {
    dataCollectionGroupId,
    skip: 0,
    limit: 100,
  });

  const [tabKey, setTabKey] = useState<string | null>('Summary');

  const sample = useSuspense(
    SampleResource.get,
    item.DataCollectionGroup.blSampleId
      ? {
          blSampleId: item.DataCollectionGroup.blSampleId,
        }
      : null
  );

  const [expandedId, setExpandedId] = usePersistentParamState<string>(
    'expandedId',
    'undefined'
  );

  const expanded = Number(expandedId) === dataCollectionGroupId;

  return (
    <div
      style={{ margin: 5, cursor: expanded ? undefined : 'pointer' }}
      onClick={() => {
        setExpandedId(dataCollectionGroupId.toString());
      }}
    >
      <Tab.Container activeKey={tabKey || 'Summary'} onSelect={setTabKey}>
        <DataCollectionBox
          {...props}
          showProcessing={false}
          buttons={[
            {
              content: <>Summary</>,
              hint: 'Summary',
              onClick: () => setTabKey('Summary'),
              hidden: !expanded,
              variant: tabKey === 'Summary' ? 'light' : 'outline-light',
            },
            {
              content: <>Parameters</>,
              hint: 'Parameters',
              onClick: () => setTabKey('Parameters'),
              hidden: !expanded,
              variant: tabKey === 'Parameters' ? 'light' : 'outline-light',
            },
          ]}
        >
          {sample && (
            <>
              {expanded ? (
                <ExpandedSSXContent
                  dcg={parent}
                  dcgItem={item}
                  dcs={dcs.results}
                  sample={sample}
                />
              ) : (
                <CompactSSXContent
                  dcgItem={item}
                  dcs={dcs.results}
                  sample={sample}
                />
              )}
            </>
          )}
        </DataCollectionBox>
      </Tab.Container>
    </div>
  );
}
