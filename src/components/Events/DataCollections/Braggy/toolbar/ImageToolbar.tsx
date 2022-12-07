import { useContext } from 'react';
import {
  ColorMapSelector,
  Domain,
  DomainSlider,
  GridToggler,
  InteractionInfo,
  ScaleSelector,
  ScaleType,
  Separator,
  Toolbar,
} from '@h5web/lib';
import type { Histogram } from '../models';
import { CIRCLE_PROFILE_KEY, LINE_PROFILE_KEY, ZOOM_KEY } from '../utils';
import RingControl from './RingControl';
import { ConfigContext, IConfigContext } from '../configContext';

export const INTERACTIONS: InteractionInfo[] = [
  { shortcut: 'Drag', description: 'Pan' },
  { shortcut: `${LINE_PROFILE_KEY}+Drag`, description: 'Draw a profile line' },
  {
    shortcut: `${CIRCLE_PROFILE_KEY}+Drag`,
    description: 'Draw a profile circle',
  },
  { shortcut: `${ZOOM_KEY}+Drag`, description: 'Select to zoom' },
  { shortcut: 'Wheel', description: 'Zoom' },
];

interface Props {
  dataDomain: Domain;
  histogram: Histogram;
}

function ImageToolbar(props: Props) {
  const { dataDomain, histogram } = props;

  const {
    customDomain,
    setCustomDomain,
    scaleType,
    setScaleType,
    colorMap,
    setColorMap,
    invertColorMap,
    setInvertColorMap,
    showGrid,
    setShowGrid,
    showRings,
    setShowRings,
  } = useContext(ConfigContext) as IConfigContext;

  return (
    <Toolbar interactions={INTERACTIONS}>
      <Separator />

      <DomainSlider
        dataDomain={dataDomain}
        customDomain={customDomain}
        scaleType={scaleType}
        onCustomDomainChange={(domain) => setCustomDomain(domain)}
        histogram={histogram}
      />

      <Separator />

      <ScaleSelector
        value={scaleType}
        onScaleChange={setScaleType}
        options={[
          ScaleType.Linear,
          ScaleType.Log,
          ScaleType.SymLog,
          ScaleType.Sqrt,
        ]}
      />

      <Separator />

      <ColorMapSelector
        value={colorMap}
        onValueChange={setColorMap}
        invert={invertColorMap}
        onInversionChange={() => setInvertColorMap(!invertColorMap)}
      />

      <Separator />

      <RingControl
        showRings={showRings}
        toggleRings={() => setShowRings(!showRings)}
      />

      <Separator />

      <GridToggler value={showGrid} onToggle={() => setShowGrid(!showGrid)} />
    </Toolbar>
  );
}

export default ImageToolbar;
