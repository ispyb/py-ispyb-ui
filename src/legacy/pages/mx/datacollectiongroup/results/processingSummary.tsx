import {
  faCheckCircle,
  faCircleExclamation,
  faCirclePlay,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSpaceGroup } from 'helpers/spacegroups';
import { useAutoProcRanking, usePipelines } from 'hooks/mx';
import {
  AutoProcIntegration,
  getRankedResults,
} from 'legacy/helpers/mx/results/resultparser';
import { useAutoProc } from 'legacy/hooks/ispyb';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import _ from 'lodash';
import { Col, Container, OverlayTrigger, Popover, Row } from 'react-bootstrap';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
}

export default function ProcessingSummary({
  proposalName,
  dataCollectionGroup,
}: Props) {
  const { data } = useAutoProc({
    proposalName,
    dataCollectionId:
      dataCollectionGroup.DataCollection_dataCollectionId.toString(),
  });

  const pipelinesSelection = usePipelines();
  const autoProcRankingSelection = useAutoProcRanking();

  if (!data || data.flatMap((d) => d).length === 0) return null;

  const results = getRankedResults(
    data.flatMap((d) => d),
    autoProcRankingSelection.rankShell,
    autoProcRankingSelection.rankParam,
    pipelinesSelection.pipelines
  );

  const groupedResults = _(results)
    .groupBy((r) => r.program)
    .entries()
    .sortBy((r) => r[0].toLowerCase())
    .value();

  return (
    <Container fluid>
      <Row>
        {groupedResults.map((r) => {
          return (
            <PipelineStatus key={r[0]} pipeline={r[0]} groupedResults={r[1]} />
          );
        })}
      </Row>
    </Container>
  );
}

function PipelineStatus({
  pipeline,
  groupedResults,
}: {
  pipeline: string;
  groupedResults: AutoProcIntegration[];
}) {
  const statuses = groupedResults.map((r) => r.status);

  const popover = (
    <Popover>
      <Popover.Header as="h3">{pipeline}</Popover.Header>
      <Popover.Body>
        <Col>
          {groupedResults.map((r) => (
            <Row key={r.programId}>
              <Col xs={'auto'}>
                <StatusIcon status={r.status} />
              </Col>
              <Col xs={'auto'}>
                {r.spaceGroup
                  ? getSpaceGroup(r.spaceGroup)?.name || r.spaceGroup
                  : 'no space group'}
              </Col>
            </Row>
          ))}
        </Col>
      </Popover.Body>
    </Popover>
  );

  return (
    <Col sm={'auto'}>
      <OverlayTrigger
        trigger={['focus', 'hover']}
        placement="auto"
        overlay={popover}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div>
            {statuses.map((s, i) => (
              <StatusIcon key={i} status={s} />
            ))}
          </div>
          <small>{pipeline}</small>
        </div>
      </OverlayTrigger>
    </Col>
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
    [icon, color] = [faCheckCircle, 'green'];
  if (status.toUpperCase() === '1') [icon, color] = [faCheckCircle, 'green'];
  return <FontAwesomeIcon color={color} icon={icon} />;
}
