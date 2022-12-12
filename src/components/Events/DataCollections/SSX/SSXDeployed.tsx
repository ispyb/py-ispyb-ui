import { SSXDataCollectionProcessingStatsResource } from 'api/resources/SSX/SSXDataCollectionProcessingStats';
import { LazyImage } from 'api/resources/XHRFile';
import LightBox from 'components/LightBox';
import Loading from 'components/Loading';
import { formatDateToDayAndTime } from 'helpers/dateparser';
import { getColorFromHitPercent } from 'helpers/ssx';
import { round } from 'lodash';
import { DataCollection, Event } from 'models/Event';
import { Sample } from 'models/Sample';
import { SSXDataCollectionProcessingStats } from 'models/SSXDataCollectionProcessingStats';
import { Suspense, useState } from 'react';
import { Col, Row, Tab } from 'react-bootstrap';
import { useSuspense } from 'rest-hooks';
import { CompactSSXContent } from './SSXCompact';
import SSXDataCollectionDetail from './SSXDataCollectionDetail';
import SSXDataCollectionGroupParameters from './SSXParameters';
import { UnitCellStatistics } from './statistics/cells';
import {
  DataCollectionGroupHitGraph,
  HitsStatisticsCumulative,
} from './statistics/hits';

export function DeployedSSXContent({
  dcg,
  dcgItem,
  dcs,
  sample,
}: {
  dcg: Event;
  dcgItem: DataCollection;
  dcs: Event[];
  sample: Sample;
}) {
  return (
    <Col>
      <CompactSSXContent dcgItem={dcgItem} dcs={dcs} sample={sample} />
      <Row>
        <Tab.Content>
          <Tab.Pane eventKey="Summary">
            <Suspense fallback={<Loading />}>
              <DataCollectionGroupSummary dcs={dcs} />
            </Suspense>
          </Tab.Pane>
          <Tab.Pane eventKey="Parameters">
            <Suspense fallback={<Loading />}>
              <SSXDataCollectionGroupParameters dcg={dcg} sample={sample} />
            </Suspense>
          </Tab.Pane>
        </Tab.Content>
      </Row>
    </Col>
  );
}

function DataCollectionGroupSummary({ dcs }: { dcs: Event[] }) {
  // const dcs = dcsData.sort(
  //   (a, b) =>
  //     parseDate(a.startTime).getTime() - parseDate(b.startTime).getTime()
  // );

  return (
    <Col>
      <Row>
        <h4 className="text-center" style={{ margin: 10 }}>
          Cumulative summary
        </h4>
      </Row>
      <Row className="flex-nowrap" style={{ overflowX: 'auto', margin: 10 }}>
        <Suspense fallback={<Loading />}>
          <Col md={'auto'}>
            <LightBox local images={['/images/temp/max.png']}>
              <LazyImage
                style={{ maxWidth: 340 }}
                local
                src="/images/temp/max.png"
              />
            </LightBox>
          </Col>
          <Col md={'auto'}>
            <Suspense fallback={<Loading />}>
              <HitsStatisticsCumulative dcs={dcs}></HitsStatisticsCumulative>
            </Suspense>
          </Col>
          <Col md={'auto'}>
            <Suspense fallback={<Loading />}>
              <DataCollectionGroupHitGraph
                dcs={dcs}
              ></DataCollectionGroupHitGraph>
            </Suspense>
          </Col>
          <Col md={'auto'}>
            <Suspense fallback={<Loading />}>
              <UnitCellStatistics dcs={dcs}></UnitCellStatistics>
            </Suspense>
          </Col>
        </Suspense>
      </Row>
      <Suspense fallback={<Loading />}>
        <DataCollectionGroupRunSummary
          dcs={dcs}
        ></DataCollectionGroupRunSummary>
      </Suspense>
    </Col>
  );
}

function DataCollectionGroupRunSummary({ dcs }: { dcs: Event[] }) {
  const dcIds = dcs.map((v) => v.id);
  const stats = useSuspense(SSXDataCollectionProcessingStatsResource.list(), {
    dataCollectionIds: dcIds,
  });

  const [selected, setSelected] = useState(0);

  const selectedDc = dcs[selected];

  return (
    <Row
      style={{
        maxHeight: 371,
        margin: 20,
        padding: 0,
        backgroundColor: '#d3d3d36b',
        border: '1px solid lightgray',
        borderRadius: 10,
      }}
    >
      <Col
        md={'auto'}
        style={{ margin: 0, marginRight: 20, padding: 0, display: 'flex' }}
      >
        <div
          style={{
            overflowY: 'auto',
            borderRight: '1px solid lightgray',
            borderRadius: '10px 0px 0px 10px',
            margin: 0,
            backgroundColor: '#345a8c8a',
            maxHeight: 369,
          }}
        >
          <div
            className="text-center"
            style={{
              margin: 0,
              marginBottom: -1,
              padding: 0,
              border: '1px solid lightgray',
              backgroundColor: '#3498db',
            }}
          >
            <span style={{ margin: 5, color: 'white', fontSize: 15 }}>
              <strong>Run #</strong>
            </span>
          </div>
          {dcs.map((dc, index) => {
            const item = dcs[index].Item;
            if ('DataCollectionGroup' in item) {
              return (
                <RunNumberTab
                  key={index}
                  dc={item}
                  selected={selected === index}
                  onClick={() => setSelected(index)}
                  stats={stats}
                  number={index + 1}
                />
              );
            } else {
              return (
                <RunNumberTab
                  key={index}
                  dc={undefined}
                  selected={selected === index}
                  onClick={() => setSelected(index)}
                  stats={stats}
                  number={index + 1}
                />
              );
            }
          })}
        </div>
      </Col>
      <Col style={{ margin: 0, padding: 0 }}>
        <Row>
          <h4 className="text-center" style={{ margin: 10 }}>
            Run #{selected + 1} summary (
            {selectedDc.startTime
              ? formatDateToDayAndTime(selectedDc.startTime)
              : ''}
            )
          </h4>
        </Row>
        <Row>
          {'DataCollectionGroup' in selectedDc.Item && (
            <Suspense fallback={<Loading />}>
              <SSXDataCollectionDetail
                dc={selectedDc}
              ></SSXDataCollectionDetail>
            </Suspense>
          )}
        </Row>
      </Col>
    </Row>
  );
}

function RunNumberTab({
  onClick,
  stats = [],
  selected,
  number,
  dc,
}: {
  onClick: () => void;
  stats: SSXDataCollectionProcessingStats[] | undefined;
  selected: boolean;
  number: number;
  dc: DataCollection | undefined;
}) {
  const statsFiltered = stats.filter(
    (s) => dc && s.dataCollectionId === dc.dataCollectionId
  );
  const stat = statsFiltered.length ? statsFiltered[0] : undefined;
  let color = selected ? 'white' : undefined;
  if (stat && dc && dc.numberOfImages) {
    const hitPercent = round((stat.nbHits / dc.numberOfImages) * 100, 2);
    color = getColorFromHitPercent(hitPercent);
  }

  return (
    <div
      onClick={onClick}
      className="text-center"
      style={{
        cursor: 'pointer',
        margin: 0,
        marginBottom: -1,
        padding: 0,
        border: '1px solid lightgray',

        backgroundColor: selected ? '#345a8c' : '#f5f5f5',
      }}
    >
      <span style={{ margin: 5, color: color }}>
        <strong>#{number}</strong>
      </span>
    </div>
  );
}
