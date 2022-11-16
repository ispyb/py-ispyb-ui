import { useSSXDataCollectionProcessingCellsHistogram } from 'hooks/pyispyb';
import { Col, Row } from 'react-bootstrap';
import PlotWidget from 'components/plotting/plotwidget';
import { SSXDataCollectionProcessingCellsHistogram } from 'models/SSXDataCollectionProcessingCellsHistogram';
import { Histogram } from 'models/Histogram';

export function UnitCellStatistics({ dcIds }: { dcIds: number[] }) {
  const { data, isError } = useSSXDataCollectionProcessingCellsHistogram({ datacollectionIds: dcIds });

  if (isError) throw Error(isError);

  if (data == undefined) {
    return <></>;
  }
  const cells1: (keyof SSXDataCollectionProcessingCellsHistogram)[] = ['a', 'b', 'c'];
  const cells2: (keyof SSXDataCollectionProcessingCellsHistogram)[] = ['alpha', 'beta', 'gamma'];

  return (
    <Row>
      <Col md={'auto'}>
        <div className="flex-nowrap">
          {cells1.map((cell) => {
            const d = data[cell];
            if (!d) return null;
            return <UnitCellParamGraph name={cell} data={d}></UnitCellParamGraph>;
          })}
        </div>
        <div className="flex-nowrap">
          {cells2.map((cell) => {
            const d = data[cell];
            if (!d) return null;
            return <UnitCellParamGraph name={cell} data={d}></UnitCellParamGraph>;
          })}
        </div>
      </Col>
    </Row>
  );
}

export function UnitCellParamGraph({ name, data }: { name: string; data: Histogram }) {
  return (
    <PlotWidget
      data={[
        {
          type: 'bar',
          y: data.y,
          x: data.x,
          opacity: 0.75,
        },
      ]}
      layout={{
        height: 150,
        width: 300,
        shapes: [
          {
            type: 'line',
            yref: 'paper',
            y0: 0,
            y1: 1,
            x0: data.median,
            x1: data.median,
            line: {
              color: 'red',
              width: 2,
              dash: 'solid',
            },
          },
        ],
        annotations: [
          {
            yref: 'paper',
            y: 1,
            x: data.median,
            text: `median = ${data.median}`,
            showarrow: false,
            yanchor: 'bottom',
            font: { color: 'gray', size: 10 },
          },
        ],
        title: `cell ${name}`,
      }}
      compact
    />
  );
}
