import React, { lazy, useState } from 'react';
import { PlotParams } from 'react-plotly.js';
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

function PlotWidget(props: PlotParams & { compact?: boolean }) {
  const [fullscreen, setFullScreen] = useState(false);
  const margin = props.layout.margin;
  props.layout.margin = props.compact
    ? {
        b: props.layout?.xaxis?.title ? 35 : 20,
        l: props.layout?.yaxis?.title ? 50 : 35,
        t: 60,
        r: 5,
        ...margin,
      }
    : props.layout.margin;
  const title = props.layout.title;
  props.layout.title = props.compact
    ? {
        yref: 'container',
        y: 40,
        yanchor: 'top',
        ...(typeof title === 'string' ? { text: title } : title),
      }
    : title;

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (fullscreen) {
      const element = ref.current;
      if (element && element.requestFullscreen) {
        element.requestFullscreen().catch((e) => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((e) => {});
      }
    }
  }, [fullscreen]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
      ref={ref}
    >
      <Plot
        {...props}
        layout={{
          modebar: {
            bgcolor: 'transparent',
            color: 'black',
            activecolor: 'black',
          },
          uirevision: 'true',
          ...props.layout,
        }}
        config={{
          displayModeBar: true,
          displaylogo: false,
          modeBarButtons: [
            ['toImage'],
            ['pan2d', 'zoom2d'],
            ['zoomIn2d', 'zoomOut2d', 'resetScale2d'],
            [
              {
                name: fullscreen ? 'Exit full screen' : 'Full screen',
                title: fullscreen ? 'Exit full screen' : 'Full screen',
                icon: {
                  width: 1000,
                  height: 1000,
                  path: 'm250 850l-187 0-63 0 0-62 0-188 63 0 0 188 187 0 0 62z m688 0l-188 0 0-62 188 0 0-188 62 0 0 188 0 62-62 0z m-875-938l0 188-63 0 0-188 0-62 63 0 187 0 0 62-187 0z m875 188l0-188-188 0 0-62 188 0 62 0 0 62 0 188-62 0z m-125 188l-1 0-93-94-156 156 156 156 92-93 2 0 0 250-250 0 0-2 93-92-156-156-156 156 94 92 0 2-250 0 0-250 0 0 93 93 157-156-157-156-93 94 0 0 0-250 250 0 0 0-94 93 156 157 156-157-93-93 0 0 250 0 0 250z',
                  transform: 'matrix(1 0 0 -1 0 850)',
                },
                click: function () {
                  setFullScreen((f) => !f);
                },
              },
            ],
          ],
          ...props.config,
        }}
      />
    </div>
  );
}

export default PlotWidget;
