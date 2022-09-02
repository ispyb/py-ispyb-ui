import { parse } from 'papaparse';
import { useXrfScanCsv } from 'hooks/ispyb';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FluorescenceSpectra } from '../model';
import InteractiveGraph from './interactivegraph';

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

  if (!csv || isError) {
    return <></>;
  }

  const parsed = parse<parseType>(csv, { header: true });

  const fields = (parsed.meta.fields || []).filter((v) => v !== 'channel' && v !== 'Energy');

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

  const showMostCommon = () => {
    const disabled = fields.filter((f) => {
      return f.search('Mn|Fe|Ni|Cu|Zn|Gd|counts') == -1;
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

  const extraButtons = [[<Button onClick={showMostCommon}>Show common elements</Button>, <Button onClick={showAuto}>Show auto fit</Button>]];

  return (
    <InteractiveGraph
      data={data}
      colors={COLORS}
      xKey={'Energy'}
      tags={tags}
      hiddenKeys={disabled}
      keys={fields}
      onHideKeys={onHideKeys}
      onShowKeys={onShowKeys}
      extraButtons={extraButtons}
    ></InteractiveGraph>
  );
}
