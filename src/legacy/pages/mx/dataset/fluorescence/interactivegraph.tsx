import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Col, Row, ButtonGroup, Button, Alert } from 'react-bootstrap';
import {
  ResponsiveContainer,
  Tooltip,
  LineChart,
  ReferenceArea,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  ReferenceLine,
  TooltipProps,
} from 'recharts';

import './interactivegraph.scss';

function getRandomColor() {
  const letters = '23456789ABCD'.split('');
  return (
    '#' +
    [0, 1, 2, 3, 4, 5]
      .map(() => letters[Math.floor(Math.random() * 12)])
      .join('')
  );
}

//Generate some more colors to use when the provided list is not enough
const EXTRA_COLORS = [...Array(100).map(getRandomColor)];

type dataType = { [x: string]: number };

type Props = {
  data: dataType[];
  keys: string[];
  hiddenKeys: string[];
  tags: { [x: string]: number };
  // eslint-disable-next-line no-unused-vars
  colors: string[];
  xKey: string;
  // eslint-disable-next-line no-unused-vars
  onShowKeys: (keys: string[]) => void;
  // eslint-disable-next-line no-unused-vars
  onHideKeys: (keys: string[]) => void;
  extraButtons: React.ReactElement[][];
  importantKeys: string[];
  xTicks?: number;
};

export default function InteractiveGraph(props: Props) {
  const [highlight, setHighlight] = useState<undefined | string>(undefined);

  const [left, setLeft] = useState<undefined | number>(undefined);
  const [right, setRight] = useState<undefined | number>(undefined);

  const [refLeft, setRefLeft] = useState<undefined | number>(undefined);
  const [refRight, setRefRight] = useState<undefined | number>(undefined);

  const colors = props.colors.slice();
  // Add the backup colors at the end of the provided list. They will be used if the provided list is not long enough
  colors.push(...EXTRA_COLORS);

  const doZoom = () => {
    if (refLeft && refRight) {
      setLeft(Math.min(refLeft, refRight));
      setRight(Math.max(refLeft, refRight));
      setRefLeft(undefined);
      setRefRight(undefined);
    }
  };

  const unZoom = () => {
    setLeft(undefined);
    setRight(undefined);
    setRefLeft(undefined);
    setRefRight(undefined);
  };

  const hideAll = () => {
    props.onHideKeys(props.keys);
  };

  const showAll = () => {
    props.onShowKeys(props.keys);
  };

  const data_in_range = props.data.filter((v: { [x: string]: number }) => {
    if (left && right) {
      return Number(left) <= v[props.xKey] && Number(right) >= v[props.xKey];
    } else {
      return true;
    }
  });
  return (
    <Col>
      <Row>
        <Col md={'auto'}>
          <Alert variant="info">
            <h5>
              <FontAwesomeIcon
                style={{ marginRight: 5 }}
                icon={faQuestionCircle}
              ></FontAwesomeIcon>
              Hover legend to highlight line, click to toggle visibility, select
              area on chart to zoom.
            </h5>
          </Alert>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col md={'auto'}>
          <ButtonGroup>
            <Button onClick={unZoom}>Reset zoom</Button>
          </ButtonGroup>
          <ButtonGroup style={{ marginLeft: 10 }}>
            <Button onClick={hideAll}>Hide all</Button>
            <Button onClick={showAll}>Show all</Button>
          </ButtonGroup>
          {props.extraButtons.map((group, index) => {
            return (
              <ButtonGroup key={index} style={{ marginLeft: 10 }}>
                {group}
              </ButtonGroup>
            );
          })}
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <div style={{ paddingRight: 20, paddingTop: 20 }}>
          <ResponsiveContainer width={'100%'} height={500}>
            <LineChart
              data={data_in_range}
              onMouseDown={(e) => {
                if (e) {
                  setRefLeft(Number(e.activeLabel));
                }
              }}
              onMouseMove={(e) => {
                if (refLeft && e) {
                  setRefRight(Number(e.activeLabel));
                }
              }}
              onMouseUp={doZoom}
              onMouseLeave={() => {
                setRefLeft(undefined);
                setRefRight(undefined);
              }}
            >
              {refLeft && refRight ? (
                <ReferenceArea x1={refLeft} x2={refRight} strokeOpacity={0.3} />
              ) : null}
              <CartesianGrid strokeDasharray="1 1" />
              <XAxis
                dataKey={props.xKey}
                type="number"
                allowDataOverflow={Boolean(left && right)}
                tickCount={props.xTicks || 10}
                domain={[
                  left || ((dataMin: number) => Math.trunc(dataMin)),
                  right || ((dataMax: number) => Math.round(dataMax)),
                ]}
              />
              <YAxis type="number" domain={['auto', 'auto']} />
              <Tooltip
                active={true}
                isAnimationActive={false}
                content={RenderTooltip}
              />
              <Legend
                onClick={(p) => {
                  if (props.hiddenKeys.includes(p.dataKey)) {
                    props.onShowKeys([p.dataKey]);
                  } else {
                    props.onHideKeys([p.dataKey]);
                  }
                }}
                onMouseEnter={(p) => {
                  setHighlight(p.dataKey);
                }}
                onMouseLeave={() => {
                  setHighlight(undefined);
                }}
                layout="vertical"
                verticalAlign="middle"
                align="left"
              />
              {renderLines({ ...props, highlight, colors })}
              {renderTags({ ...props, highlight, colors })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Row>
    </Col>
  );
}

export function renderLines(
  props: Props & { highlight?: string; colors: string[] }
) {
  const getLineWidth = (key: string) => {
    if (props.highlight) {
      if (props.highlight === key) return 4;
      return 1.5;
    }
    if (props.importantKeys.includes(key)) return 6;
    return 1.5;
  };
  const getLineZ = (key: string) => {
    if (props.highlight === key) return -2;
    if (props.importantKeys.includes(key)) return -1;
    return 1;
  };
  return props.keys.map((key) => (
    <Line
      key={key}
      dataKey={key}
      type="linear"
      legendType={props.hiddenKeys.includes(key) ? 'cross' : 'plainline'}
      stroke={props.colors[props.keys.indexOf(key)]}
      dot={false}
      strokeWidth={getLineWidth(key)}
      z={getLineZ(key)}
      strokeDasharray={
        props.highlight && props.highlight !== key ? '5 5' : undefined
      }
      hide={props.hiddenKeys.includes(key) && props.highlight !== key}
      isAnimationActive={false}
    ></Line>
  ));
}

export function renderTags(
  props: Props & { highlight?: string; colors: string[] }
) {
  return props.keys
    .filter((key) => {
      if (props.hiddenKeys.includes(key) && props.highlight !== key)
        return false;
      if (!(key in props.tags)) return false;
      return true;
    })
    .sort((a, b) => {
      return props.tags[b] - props.tags[a];
    })
    .map((key, index) => {
      const color = props.colors[props.keys.indexOf(key)];
      return (
        <ReferenceLine
          key={key}
          x={props.tags[key]}
          stroke={color}
          strokeWidth={0.5}
          strokeDasharray={'10 10'}
          label={<ReferenceLabel value={key} fill={color} index={index} />}
        ></ReferenceLine>
      );
    });
}

export function RenderTooltip(props: TooltipProps<number, string>) {
  if (!props.active) return null;
  return (
    <Col style={{ backgroundColor: 'white', border: '1px solid grey' }}>
      <Row>
        <Col></Col>
        <Col md={'auto'}>
          <h5>{props.label}</h5>
        </Col>
        <Col></Col>
      </Row>
      {props.payload &&
        props.payload
          .filter((p) => p.value !== 0)
          .map((p) => {
            return (
              <Row key={p.dataKey}>
                <p style={{ color: p.color, marginTop: 0, marginBottom: 0 }}>
                  {p.dataKey} = {p.value}
                </p>
              </Row>
            );
          })}
    </Col>
  );
}

export function ReferenceLabel({
  fill,
  value,
  viewBox,
  index,
}: {
  fill: string;
  value: string;
  viewBox?: { x: number; y: number };
  index: number;
}) {
  const x = (viewBox?.x || 0) - 3 * value.length;
  const y = (viewBox?.y || 0) + (index % 2) * 25;

  return (
    <foreignObject x={x} y={y} width={1} height={1} overflow={'visible'}>
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid grey',
          display: 'inline',
        }}
      >
        <small style={{ color: fill, whiteSpace: 'nowrap' }}>{value}</small>
      </div>
    </foreignObject>
  );
}
