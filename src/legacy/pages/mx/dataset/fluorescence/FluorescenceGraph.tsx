import PlotWidget from 'components/Plotting/plotwidget';
import { FluorescenceSpectra } from '../../model';
import { useXrfScanCsv } from 'legacy/hooks/ispyb';
import { parse } from 'papaparse';
import { Annotations, Data, Shape } from 'plotly.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import _ from 'lodash';

export function FluorescenceGraph({
  proposalName,
  spectra,
}: {
  proposalName: string;
  spectra: FluorescenceSpectra;
}) {
  const csv =
    useXrfScanCsv({
      proposalName,
      scanId: spectra.xfeFluorescenceSpectrumId,
    }).data || '';

  const [disabled, setDisabled] = useState<string[]>([]);

  const [highlighted, setHighlighted] = useState<string | null>(null);

  const parsed = useMemo(
    () => parse<{ [x: string]: string }>(csv, { header: true }),
    [csv]
  );

  const fields = useMemo(
    () =>
      (parsed.meta.fields || []).filter(
        (v) => v !== 'channel' && v !== 'Energy'
      ),
    [parsed.meta.fields]
  );

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.legendtoggle').forEach((e, i) => {
        const field = fields[i];
        e.addEventListener('mouseover', (e) => {
          e.stopPropagation();
          setHighlighted(field);
        });
        e.addEventListener('mouseout', (e) => {
          e.stopPropagation();
          setHighlighted(null);
        });
      });
    }, 5000);
  }, [fields, setHighlighted]);

  const x = useMemo(
    () => parsed.data.map((d) => parseFloat(d['Energy'])),
    [parsed]
  );

  const values = useMemo(
    () =>
      fields.map((k) => {
        const y = parsed.data.map((d) => parseFloat(d[k]));
        return {
          x,
          y,
          name: k,
        };
      }),
    [fields, parsed, x]
  );

  const fit = useMemo(
    () => values.filter((v) => v.name.includes('fit'))[0],
    [values]
  );

  const maxValues = useMemo(
    () =>
      values
        .filter((v) => v.name.startsWith('y'))
        .map((v) => {
          const max = _(v.y).max();
          if (max === undefined) return undefined;
          const maxIndex = v.y.indexOf(max);
          if (maxIndex === -1) return undefined;
          return {
            x: x[maxIndex],
            y: max,
            fit: fit.y[maxIndex],
            name: v.name,
          };
        })
        .filter((v) => v !== undefined) as {
        x: number;
        y: number;
        fit: number;
        name: string;
      }[],
    [fit, values, x]
  );

  const showAuto = useCallback(() => {
    const disabledElems = maxValues
      .filter((m) => {
        return m.y < m.fit * 0.8;
      })
      .map((v) => v.name);
    const disabledParams = fields
      .filter((f) => !f.startsWith('y'))
      .filter((f) => !f.includes('fit'));

    setDisabled([...disabledElems, ...disabledParams]);
  }, [maxValues, fields]);
  const showMostCommon = useCallback(() => {
    const disabled = fields.filter((f) => {
      return f.search('Mn|Fe|Ni|Cu|Zn|Gd|counts') === -1;
    });
    setDisabled(disabled);
  }, [fields]);
  const hideAll = useCallback(() => {
    setDisabled(fields);
  }, [fields]);
  const showAll = useCallback(() => {
    setDisabled([]);
  }, []);

  const plots: Data[] = useMemo(
    () =>
      values.map((e) => ({
        ...e,
        type: 'scattergl',
        mode: 'lines',
        visible: disabled.includes(e.name) ? 'legendonly' : true,

        line:
          highlighted === null
            ? {}
            : highlighted === e.name
            ? {
                width: 4,
              }
            : {
                width: 1,
                dash: 'dot',
              },
      })),
    [values, disabled, highlighted]
  );

  const lines: Partial<Shape>[] = useMemo(
    () =>
      maxValues
        .filter((v) => !disabled.includes(v.name))
        .map((v) => ({
          type: 'line',
          yref: 'paper',
          y0: 0,
          y1: 1,
          x0: v.x,
          x1: v.x,
          line: {
            color: 'black',
            width: 1,
            dash: 'dash',
          },
        })),
    [maxValues, disabled]
  );

  const getAnnotationPosition = useCallback(
    (index: number) => {
      const angleStep = (2 * Math.PI) / maxValues.length;
      const radius = 100;
      const angle = Math.PI + angleStep * index;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return { x, y };
    },
    [maxValues]
  );

  const annotations = useMemo(
    (): Partial<Annotations>[] =>
      maxValues.map((v, i) => {
        const position = getAnnotationPosition(i);
        return {
          x: v.x,
          y: v.y,
          xref: 'x',
          yref: 'y',
          text: v.name,
          showarrow: true,
          arrowcolor: 'black',
          arrowwidth: 3,
          arrowhead: 7,
          ax: position.x,
          ay: position.y,
          bgcolor: 'white',
          bordercolor: 'black',
        };
      }),
    [getAnnotationPosition, maxValues]
  ).filter((a) => !disabled.includes(a.text as string));

  return (
    <Container fluid>
      <Row>
        <Col xs={'auto'}>
          <Button key={0} onClick={hideAll}>
            Hide all
          </Button>
        </Col>
        <Col xs={'auto'}>
          <Button key={0} onClick={showAll}>
            Show all
          </Button>
        </Col>
        <Col xs={'auto'}>
          <Button key={0} onClick={showMostCommon}>
            Show common elements
          </Button>
        </Col>
        <Col xs={'auto'}>
          <Button key={0} onClick={showAuto}>
            Show auto fit
          </Button>
        </Col>
      </Row>
      <Row></Row>
      <PlotWidget
        data={plots}
        layout={{
          hovermode: 'x unified',
          shapes: lines,
          annotations: annotations,
        }}
        compact
        useResizeHandler
        style={{ width: '100%' }}
        onLegendClick={(e) => {
          if (disabled.includes(fields[e.curveNumber])) {
            setDisabled(disabled.filter((d) => d !== fields[e.curveNumber]));
          } else {
            setDisabled([...disabled, fields[e.curveNumber]]);
          }
          return false;
        }}
      />
    </Container>
  );
}
