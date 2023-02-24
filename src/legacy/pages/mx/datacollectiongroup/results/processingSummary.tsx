import {
  faCheckCircle,
  faCircleExclamation,
  faCirclePlay,
  faCircleQuestion,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  getRankedResults,
  ResultRankParam,
  ResultRankShell,
} from 'legacy/helpers/mx/results/resultparser';
import { useSubDatasets } from 'legacy/hooks/icat';
import { Dataset, getNotes } from 'legacy/hooks/icatmodel';
import { useAutoProc } from 'legacy/hooks/ispyb';
import {
  AutoProcInformation,
  DataCollectionGroup,
} from 'legacy/pages/mx/model';
import _ from 'lodash';
import {
  Card,
  Col,
  Container,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';

export interface Props {
  proposalName: string;
  dataCollectionGroup: Dataset;
  selectedPipelines: string[];
  resultRankShell: ResultRankShell;
  resultRankParam: ResultRankParam;
}

export default function ProcessingSummary({
  proposalName,
  dataCollectionGroup,
  selectedPipelines,
  resultRankShell,
  resultRankParam,
}: Props) {
  const { data: autoprocintegrations } = useSubDatasets({
    dataset: dataCollectionGroup,
    type: 'autoprocintegration',
  });
  const data = autoprocintegrations.map(getNotes<AutoProcInformation>);

  if (!data || data.flatMap((d) => d).length === 0) return null;

  const results = getRankedResults(
    data,
    resultRankShell,
    resultRankParam,
    selectedPipelines
  );

  return (
    <Card.Footer>
      <Container fluid>
        <Row>
          {results.map((r) => {
            return (
              <Col sm={'auto'} key={r.id}>
                <OverlayTrigger
                  trigger={['focus', 'hover']}
                  placement="bottom"
                  overlay={
                    <Popover>
                      <Popover.Body>{r.status}</Popover.Body>
                    </Popover>
                  }
                >
                  <div>
                    <StatusIcon status={r.status} /> <small>{r.program}</small>
                  </div>
                </OverlayTrigger>
              </Col>
            );
          })}
        </Row>
      </Container>
    </Card.Footer>
  );
}

function StatusIcon({ status }: { status: string }) {
  let icon = faQuestionCircle;
  let color = 'black';
  if (status.toUpperCase() === 'FAILED')
    [icon, color] = [faCircleExclamation, 'red'];
  if (status.toUpperCase() === 'RUNNING')
    [icon, color] = [faCirclePlay, 'orange'];
  if (status.toUpperCase() === 'SUCCESS')
    [icon, color] = [faCheckCircle, 'green'];
  if (status.toUpperCase() === 'NO_RESULTS')
    [icon, color] = [faCircleQuestion, 'blue'];
  if (status.toUpperCase() === '1') [icon, color] = [faCheckCircle, 'green'];
  return <FontAwesomeIcon color={color} icon={icon} />;
}
