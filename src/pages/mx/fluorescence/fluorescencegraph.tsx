import { parse } from 'papaparse';
import { useXrfScanCsv } from 'hooks/ispyb';
import { useState } from 'react';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { ResponsiveContainer, Tooltip, LineChart, ReferenceArea, CartesianGrid, XAxis, YAxis, Legend, Line } from 'recharts';
import { FluorescenceSpectra } from '../model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

type Props = {
  proposalName: string;
  spectra: FluorescenceSpectra;
};

type parseType = { [x: string]: number };

function getRandomColor() {
  const letters = '23456789ABCD'.split('');
  return '#' + [0, 1, 2, 3, 4, 5].map(() => letters[Math.floor(Math.random() * 12)]).join('');
}

const COLORS = [...Array(100).keys()].map(getRandomColor);

export default function FluorescenceGraph({ proposalName, spectra }: Props) {
  const { data: csv, isError } = useXrfScanCsv({ proposalName, scanId: spectra.xfeFluorescenceSpectrumId });

  const [disabled, setDisabled] = useState<string[]>([]);
  const [highlight, setHighlight] = useState<undefined | string>(undefined);

  const [left, setLeft] = useState<undefined | number>(undefined);
  const [right, setRight] = useState<undefined | number>(undefined);

  const [refLeft, setRefLeft] = useState<undefined | number>(undefined);
  const [refRight, setRefRight] = useState<undefined | number>(undefined);

  if (!csv || isError) {
    return <></>;
  }

  const parsed = parse<parseType>(csv, { header: true });

  const fields = (parsed.meta.fields || []).filter((v) => v !== 'channel' && v !== 'Energy');

  const r = parsed.data
    .map((d) => {
      const r: parseType = {};
      for (const a in d) {
        r[a] = Number(d[a]);
      }
      return r;
    })
    .filter((v: { [x: string]: number }) => {
      if (left && right) {
        return Number(left) <= v['Energy'] && Number(right) >= v['Energy'];
      } else {
        return true;
      }
    });

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
    setDisabled(fields);
  };

  const showAll = () => {
    setDisabled([]);
  };

  return (
    <Col>
      <Row>
        <div style={{ paddingRight: 20 }}>
          <ResponsiveContainer width={'100%'} height={500}>
            <LineChart
              data={r}
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
              {refLeft && refRight ? <ReferenceArea x1={refLeft} x2={refRight} strokeOpacity={0.3} /> : null}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="Energy"
                type="number"
                allowDataOverflow={Boolean(left && right)}
                domain={[left || ((dataMin: number) => Math.trunc(dataMin)), right || ((dataMax: number) => Math.round(dataMax))]}
              />
              <YAxis type="number" domain={['auto', 'auto']} />
              <Tooltip active={true} isAnimationActive={false} />
              <Legend
                onClick={(p) => {
                  if (disabled.includes(p.dataKey)) {
                    setDisabled(disabled.filter((e) => e !== p.dataKey));
                  } else {
                    const n = disabled.slice();
                    n.push(p.dataKey);
                    setDisabled(n);
                  }
                }}
                onMouseEnter={(p) => {
                  setHighlight(p.dataKey);
                }}
                onMouseLeave={() => {
                  setHighlight(undefined);
                }}
              />
              {fields.map((a, index) => (
                <Line
                  key={a}
                  type="linear"
                  legendType={disabled.includes(a) ? 'cross' : 'plainline'}
                  dataKey={a}
                  stroke={COLORS[index]}
                  dot={false}
                  strokeWidth={highlight === a ? 3 : 1}
                  strokeDasharray={highlight && highlight !== a ? '5 5' : undefined}
                  hide={disabled.includes(a) && highlight !== a}
                  isAnimationActive={false}
                  //   name={r.filter((l) => l[a])}
                ></Line>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Row>
      <Row>
        <Col></Col>
        <Col md={'auto'}>
          <p>
            <FontAwesomeIcon style={{ marginRight: 5 }} icon={faQuestionCircle}></FontAwesomeIcon>Hover legend to highlight line, click to toggle visibility, select area on chart
            to zoom.
          </p>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col md={'auto'}>
          <ButtonGroup>
            <Button onClick={unZoom}>reset zoom</Button>
            <Button onClick={hideAll}>hide all</Button>
            <Button onClick={showAll}>show all</Button>
          </ButtonGroup>
        </Col>
        <Col></Col>
      </Row>
    </Col>
  );
}
