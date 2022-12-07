import { Sample } from 'models/Sample.d';
import { getColors } from 'utils/colours';
import { Badge } from 'react-bootstrap';

export function getSampleState(sample: Sample) {
  const stateColors = {
    'Sample Action': '#ff6961',
    Characterized: '#fdfd96',
    Strategy: '#ffb347',
    'Data Collected': '#87ceeb',
    'Auto Integrated': '#77dd77',
  };

  const state =
    sample._metadata &&
    (sample._metadata?.autoIntegrations &&
    sample._metadata?.autoIntegrations > 0
      ? 'Auto Integrated'
      : sample._metadata?.datacollections &&
        sample._metadata?.datacollections > 0
      ? 'Data Collected'
      : sample._metadata?.strategies && sample._metadata?.strategies > 0
      ? 'Strategy'
      : sample._metadata?.types && 'Characterization' in sample._metadata?.types
      ? 'Characterized'
      : null);

  const hasState = state && state in stateColors;
  return hasState && { state, color: stateColors[state] };
}

export default function SampleStatus(sample: Sample) {
  const state = getSampleState(sample);
  return state ? (
    <Badge
      bg="light"
      style={{
        color: `${state.color}`,
      }}
    >
      {state.state}
    </Badge>
  ) : null;
}

export function DCTypes(sample: Sample) {
  const states = [
    'Characterization',
    'OSC',
    'SAD',
    'Helical',
    'Mesh',
    'XRF map',
    'XRF map xas',
    'Energy Scan',
    'EM',
    'Tomo',
  ];

  const colors = Object.fromEntries(
    getColors(states.length).map((color, i) => [states[i], color])
  );

  return (
    <>
      {sample._metadata?.types?.map((type) => (
        <Badge
          key={type}
          bg="light"
          style={{
            color: `${colors[type]}`,
          }}
        >
          {type}
        </Badge>
      ))}
    </>
  );
}
