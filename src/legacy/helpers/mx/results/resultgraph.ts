export const GRAPH_PARAMS = [
  'completeness',
  'rfactor',
  'isigma',
  'cc2',
  'sigmaano',
  'wilson',
  'anomcorr',
] as const;

export type GraphParamType = typeof GRAPH_PARAMS[number];
