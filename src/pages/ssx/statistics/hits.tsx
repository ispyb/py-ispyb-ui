import { useSSXDataCollectionProcessingStats } from 'hooks/pyispyb';
import PlotWidget from 'components/plotting/plotwidget';
import { DataCollection, Event } from 'models/Event';
import _, { round } from 'lodash';
import { getColorFromHitPercent, getColorFromIndexedPercent } from 'helpers/ssx';
import { SSXDataCollectionProcessingStats } from 'models/SSXDataCollectionProcessingStats';
import { ProgressBar } from 'react-bootstrap';

export function HitsStatistics({ dc }: { dc: DataCollection }) {
  const { data, isError } = useSSXDataCollectionProcessingStats({ datacollectionIds: [dc.dataCollectionId] });

  if (isError) throw Error(isError);

  if (data == undefined || !data.length || !dc.numberOfImages) {
    return <></>;
  }

  const proc = data[0];

  return <HitsStatisticsGraph nbImages={dc.numberOfImages} nbHits={proc.nbHits} nbIndexed={proc.nbIndexed}></HitsStatisticsGraph>;
}

export function HitsStatisticsCumulative({ dcs }: { dcs: Event[] }) {
  const dcIds = dcs.map((v) => v.id);
  const { data, isError } = useSSXDataCollectionProcessingStats({ datacollectionIds: dcIds });

  if (isError) throw Error(isError);

  const nbImages = dcs
    .map((dc) => {
      return 'DataCollectionGroup' in dc.Item && dc.Item.numberOfImages ? dc.Item.numberOfImages : 0;
    })
    .reduce((a, b) => a + b, 0);

  if (data == undefined || !data.length || !nbImages) {
    return <></>;
  }

  const nbHits = data.map((d) => d.nbHits).reduce((a, b) => a + b, 0);
  const nbIndexed = data.map((d) => d.nbIndexed).reduce((a, b) => a + b, 0);
  return <HitsStatisticsGraph nbImages={nbImages} nbHits={nbHits} nbIndexed={nbIndexed}></HitsStatisticsGraph>;
}

export function CompactHitsStatisticsCumulative({ dcs }: { dcs: Event[] }) {
  const dcIds = dcs.map((v) => v.id);
  const { data, isError } = useSSXDataCollectionProcessingStats({ datacollectionIds: dcIds });

  if (isError) throw Error(isError);

  const nbImages = dcs
    .map((dc) => {
      return 'DataCollectionGroup' in dc.Item && dc.Item.numberOfImages ? dc.Item.numberOfImages : 0;
    })
    .reduce((a, b) => a + b, 0);

  if (data == undefined || !data.length || !nbImages) {
    return <></>;
  }

  const nbHits = data.map((d) => d.nbHits).reduce((a, b) => a + b, 0);
  const nbIndexed = data.map((d) => d.nbIndexed).reduce((a, b) => a + b, 0);

  const indexedPercent = (nbIndexed / nbImages) * 100;
  const hitsPercent = (nbHits / nbImages) * 100;

  return (
    <ProgressBar style={{ marginRight: 10, marginBottom: 10, marginTop: 5, marginLeft: 5 }}>
      <ProgressBar
        label={`${nbIndexed.toLocaleString()} indexed (${round(indexedPercent, 2)}%)`}
        style={{ backgroundColor: getColorFromIndexedPercent(indexedPercent) }}
        now={indexedPercent}
        key={'indexed'}
      />
      <ProgressBar
        label={`${(nbHits - nbIndexed).toLocaleString()} non-indexed hits (${round(hitsPercent - indexedPercent, 2)}%)`}
        style={{ backgroundColor: getColorFromHitPercent(hitsPercent) }}
        now={hitsPercent - indexedPercent}
        key={'hits'}
      />
      <ProgressBar label={`${(nbImages - nbHits).toLocaleString()} skipped images (${round(100 - hitsPercent, 2)}%)`} variant="primary" now={100 - hitsPercent} key={'images'} />
    </ProgressBar>
  );
}

function HitsStatisticsGraph({ nbImages, nbHits, nbIndexed }: { nbImages: number; nbHits: number; nbIndexed: number }) {
  if (nbImages == 0) return null;

  const hitPercent = round((nbHits / nbImages) * 100, 2);
  const hitColor = getColorFromHitPercent(hitPercent);
  const indexedPercent = round((nbIndexed / nbImages) * 100, 2);
  const indexedColor = getColorFromIndexedPercent(indexedPercent);

  return (
    <PlotWidget
      data={[
        {
          type: 'sunburst',
          labels: ['Images', 'Hits', 'Indexed'],
          parents: ['', 'Images', 'Hits', 'Hits'],
          values: [nbImages, nbHits, nbIndexed],
          marker: { line: { width: 1, color: 'white' }, colors: ['rgb(130 174 231)', hitColor, indexedColor] },
          text: ['', `${hitPercent}%`, `${indexedPercent}%`],
          textinfo: 'label+text+value',
          branchvalues: 'total',
        },
      ]}
      config={{ displayModeBar: false }}
      layout={{
        paper_bgcolor: 'transparent',
        margin: { l: 0, r: 0, b: 0, t: 0 },
        width: 300,
        height: 300,
      }}
    />
  );
}

function getStats(stats: SSXDataCollectionProcessingStats[], id: number) {
  for (const stat of stats) {
    if (stat.dataCollectionId == id) return stat;
  }
  return undefined;
}

export function DataCollectionGroupHitGraph({ dcs }: { dcs: Event[] }) {
  const dcIds = dcs.map((v) => v.id);
  const { data, isError } = useSSXDataCollectionProcessingStats({ datacollectionIds: dcIds });

  if (isError) throw Error(isError);

  if (data == undefined || !data.length) {
    return <></>;
  }

  const nbImages = dcs.map((dc) => {
    return 'DataCollectionGroup' in dc.Item && dc.Item.numberOfImages ? dc.Item.numberOfImages : 0;
  });

  const x = _.range(1, data.length + 1);
  const y1 = dcs.map((dc) => getStats(data, dc.id)?.nbHits || 0);
  const y2 = dcs.map((dc) => getStats(data, dc.id)?.nbIndexed || 0);
  const colors = dcs.map((dc, index) => {
    const stats = getStats(data, dc.id);
    if (!stats) return 'white';
    return getColorFromHitPercent((y1[index] / nbImages[index]) * 100);
  });

  return (
    <PlotWidget
      data={[
        {
          type: 'bar',
          y: y1,
          x: x,
          opacity: 0.75,
          name: 'hits',
          marker: { color: 'blue' },
        },
        {
          type: 'bar',
          y: y2,
          x: x,
          opacity: 0.75,
          name: 'indexed',
          marker: { color: 'orange' },
        },
      ]}
      layout={{
        height: 300,
        width: 500,
        title: `run number statistics`,
        xaxis: { title: 'run number', tickangle: -90, tickvals: x },
        yaxis: { title: 'image count' },

        shapes: x.map((v, index) => {
          return {
            type: 'rect',
            x0: v - 0.5,
            x1: v + 0.5,
            yref: 'paper',
            y0: 0,
            y1: 1,
            fillcolor: colors[index],
            layer: 'below',
            line: { width: 0 },
            opacity: 0.3,
          };
        }),
      }}
      compact
    />
  );
}
