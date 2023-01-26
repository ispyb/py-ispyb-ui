import { getRankedResults } from 'legacy/helpers/mx/results/resultparser';
import { useAutoProc } from 'legacy/hooks/ispyb';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import { Button, Col, Row } from 'react-bootstrap';
import { useState } from 'react';
import { ResultTable } from './resultTable';
import { ResultGraph } from './resultGraph';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
  selectedPipelines: string[];
}

export default function ResultsDataCollectionGroupPanel({
  proposalName,
  dataCollectionGroup,
  selectedPipelines,
}: Props) {
  const [view, setView] = useState(0);

  const { data } = useAutoProc({
    proposalName,
    dataCollectionId:
      dataCollectionGroup.DataCollection_dataCollectionId.toString(),
  });
  if (!data || !data.length) return null;

  const results = getRankedResults(data.flatMap((d) => d)).filter(
    (v) =>
      selectedPipelines.includes(v.program) || selectedPipelines.length === 0
  );

  return (
    <Col>
      <Row>
        <Col xs={'auto'}>
          <Button
            variant={view === 0 ? 'primary' : 'outline-primary'}
            onClick={() => setView(0)}
            size="sm"
          >
            Table
          </Button>
        </Col>
        <Col xs={'auto'}>
          <Button
            variant={view === 1 ? 'primary' : 'outline-primary'}
            onClick={() => setView(1)}
            size="sm"
          >
            Graph
          </Button>
        </Col>
      </Row>
      <div
        style={{
          height: 0,
          borderBottom: '1px solid lightgray',
          marginTop: 10,
          marginBottom: 10,
        }}
      />
      {view === 0 && <ResultTable results={results} />}
      {view === 1 && <ResultGraph results={results} />}
    </Col>
  );
}
