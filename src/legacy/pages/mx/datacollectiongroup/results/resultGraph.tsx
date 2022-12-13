import { GRAPH_PARAMS } from 'legacy/helpers/mx/results/resultgraph';
import { AutoProcIntegration } from 'legacy/helpers/mx/results/resultparser';

export function ResultGraph({ results }: { results: AutoProcIntegration[] }) {
  const param = GRAPH_PARAMS[0];
  return <>{param}</>;
}
