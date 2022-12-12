import Plotly from 'plotly.js';
import Plot, { PlotParams } from 'react-plotly.js';

// @ts-ignore
interface PlotParamsOptionalLayout extends PlotParams {
  layout?: Partial<Plotly.Layout>;
  title?: string;
}

export default function PlotEnhancer(props: PlotParamsOptionalLayout) {
  const { layout, config, ...rest } = props;
  return (
    <Plot
      style={{ width: '100%', height: '100%' }}
      useResizeHandler
      layout={{
        autosize: true,
        showlegend: false,
        margin: {
          l: 50,
          r: 20,
          b: 50,
          t: 50,
          pad: 10,
        },
        ...layout,
      }}
      config={{
        displaylogo: false,
        displayModeBar: false,
        modeBarButtonsToRemove: ['toImage'],
        ...config,
      }}
      {...rest}
    />
  );
}
