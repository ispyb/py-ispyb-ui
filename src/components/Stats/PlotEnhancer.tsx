import { lazy } from 'react';
import { PlotParams } from 'react-plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = lazy(() =>
  import('plotly.js-dist-min' /* webpackChunkName: "plotly" */).then(
    (Plotly) => ({
      default: createPlotlyComponent(Plotly),
    })
  )
);

// @ts-ignore
interface PlotParamsOptionalLayout extends PlotParams {
  layout?: PlotParams['layout'];
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
