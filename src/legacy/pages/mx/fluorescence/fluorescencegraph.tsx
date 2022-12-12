import { parse } from 'papaparse';
import { useXrfScanCsv } from 'legacy/hooks/ispyb';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FluorescenceSpectra } from '../model';
import InteractiveGraph from './interactivegraph';

type Props = {
  proposalName: string;
  spectra: FluorescenceSpectra;
};

type parseType = { [x: string]: number };

const COLORS = [
  'black',
  '#c44b4b',
  'green',
  '#ad6b05',
  '#8a0a7f',
  '#948a00',
  '#e1c4ff',
  '#ed72e3',
  '#3efaac',
  '#846d9c',
  '#00d0ff',
  '#fcba56',
  '#849ba1',
  '#2d458a',
  '#be82ff',
  '#047064',
  '#5d00bd',
];

export default function FluorescenceGraph({ proposalName, spectra }: Props) {
  const { data: csv, isError } = useXrfScanCsv({
    proposalName,
    scanId: spectra.xfeFluorescenceSpectrumId,
  });

  const [disabled, setDisabled] = useState<string[]>([]);

  if (!csv || isError) {
    return <></>;
  }

  const parsed = parse<parseType>(csv, { header: true });

  const fields = (parsed.meta.fields || []).filter(
    (v) => v !== 'channel' && v !== 'Energy'
  );

  const maxValues: { [x: string]: { x: number; y: number; fit: number } } = {};

  const data = parsed.data.map((d) => {
    const r: parseType = {};
    for (const a in d) {
      const x = Number(d['Energy']);
      const y = Number(d[a]);
      const fit = Number(d['fit']);
      r[a] = y;
      if (a.startsWith('y')) {
        if (a in maxValues) {
          const max = maxValues[a].y;
          if (max < y) {
            maxValues[a] = { x, y, fit };
          }
        } else {
          maxValues[a] = { x, y, fit };
        }
      }
    }
    return r;
  });

  const tags: { [x: string]: number } = {};

  for (const v in maxValues) {
    tags[v] = maxValues[v].x;
  }

  const xKey = 'Energy';
  const xTicks = Math.round(Math.max(...data.map((v) => v[xKey] || 0)));

  const showMostCommon = () => {
    const disabled = fields.filter((f) => {
      return f.search('Mn|Fe|Ni|Cu|Zn|Gd|counts') === -1;
    });
    setDisabled(disabled);
  };

  const showAuto = () => {
    const disabled = fields
      .filter((f) => {
        return !(f in maxValues) || maxValues[f].y < maxValues[f].fit * 0.8;
      })
      .filter((v) => !v.includes('fit'));
    setDisabled(disabled);
  };

  const onHideKeys = (keys: string[]) => {
    const new_disabled = disabled.slice();
    new_disabled.push(...keys);
    setDisabled(new_disabled);
  };

  const onShowKeys = (keys: string[]) => {
    const new_disabled = disabled.filter((key) => !keys.includes(key));
    setDisabled(new_disabled);
  };

  const extraButtons = [
    [
      <Button key={0} onClick={showMostCommon}>
        Show common elements
      </Button>,
      <Button key={1} onClick={showAuto}>
        Show auto fit
      </Button>,
    ],
  ];

  return (
    <InteractiveGraph
      data={data}
      colors={COLORS}
      xKey={xKey}
      xTicks={xTicks}
      tags={tags}
      hiddenKeys={disabled}
      keys={fields}
      onHideKeys={onHideKeys}
      onShowKeys={onShowKeys}
      extraButtons={extraButtons}
      importantKeys={['fit']}
    ></InteractiveGraph>
  );
}
