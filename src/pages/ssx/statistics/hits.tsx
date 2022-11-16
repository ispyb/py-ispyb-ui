import { useSSXDataCollectionProcessingStats } from 'hooks/pyispyb';
import PlotWidget from 'components/plotting/plotwidget';
import { DataCollection, Event } from 'models/Event';
import _, { round } from 'lodash';
import { getColorFromHitPercent } from 'helpers/ssx';

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

function HitsStatisticsGraph({ nbImages, nbHits, nbIndexed }: { nbImages: number; nbHits: number; nbIndexed: number }) {
  if (nbImages == 0) return null;

  const hitPercent = round((nbHits / nbImages) * 100, 2);
  const hitColor = getColorFromHitPercent(hitPercent);
  const indexedPercent = round((nbIndexed / nbImages) * 100, 2);
  const indexedColor = getColorFromHitPercent(indexedPercent);

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

export function DataCollectionGroupHitGraph({ dcs }: { dcs: Event[] }) {
  const dcIds = dcs.map((v) => v.id);
  const { data, isError } = useSSXDataCollectionProcessingStats({ datacollectionIds: dcIds });

  if (isError) throw Error(isError);

  if (data == undefined || !data.length) {
    return <></>;
  }

  const x = _.range(1, data.length + 1);
  const y1 = data.map((d) => d.nbHits);
  const y2 = data.map((d) => d.nbIndexed);

  return (
    <PlotWidget
      data={[
        {
          type: 'bar',
          y: y1,
          x: x,
          opacity: 0.75,
          name: 'hits',
        },
        {
          type: 'bar',
          y: y2,
          x: x,
          opacity: 0.75,
          name: 'indexed',
        },
      ]}
      layout={{ height: 300, width: 400, title: `run number statistics`, xaxis: { title: 'run number' }, yaxis: { title: 'image count' } }}
      compact
    />
  );
}
