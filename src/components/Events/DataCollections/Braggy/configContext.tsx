import { createContext, useState } from 'react';

import { ColorMap, CustomDomain, ScaleType } from '@h5web/lib';

export interface IConfigContext {
  customDomain: CustomDomain;
  setCustomDomain: (customDomain: CustomDomain) => void;
  scaleType: ScaleType;
  setScaleType: (scaleType: ScaleType) => void;
  colorMap: ColorMap;
  setColorMap: (colorMap: ColorMap) => void;
  invertColorMap: boolean;
  setInvertColorMap: (invertColorMap: boolean) => void;
  showGrid: boolean;
  setShowGrid: (showGrid: boolean) => void;
  showRings: boolean;
  setShowRings: (showRings: boolean) => void;
}

export const ConfigContext = createContext<IConfigContext | null>(null);

export function ConfigProvider({ children }: { children: JSX.Element }) {
  const [customDomain, setCustomDomain] = useState<CustomDomain>([null, null]);
  const [scaleType, setScaleType] = useState<ScaleType>(ScaleType.Linear);
  const [colorMap, setColorMap] = useState<ColorMap>('Viridis');
  const [invertColorMap, setInvertColorMap] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showRings, setShowRings] = useState<boolean>(true);

  const config = {
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
  };
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}
