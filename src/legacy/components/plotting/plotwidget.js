import React, { lazy } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';

// https://reactjs.org/docs/code-splitting.html
// https://github.com/plotly/react-plotly.js#customizing-the-plotlyjs-bundle
const Plot = lazy(() =>
  import('plotly.js-dist-min' /* webpackChunkName: "plotly" */).then(
    (Plotly) => ({
      default: createPlotlyComponent(Plotly),
    })
  )
);

function PlotWidget(props) {
  return <Plot {...props} />;
}

export default PlotWidget;
