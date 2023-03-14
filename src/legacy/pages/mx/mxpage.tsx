import { PropsWithChildren, Suspense } from 'react';
import SessionTabMenu from 'legacy/pages/mx/sessiontabmenu';
import { useAutoProc, useMXDataCollectionsBy } from 'legacy/hooks/ispyb';
import { useAutoProcRanking, usePipelines } from 'hooks/mx';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  parseResults,
  RESULT_RANK_PARAM,
  RESULT_RANK_SHELLS,
} from 'legacy/helpers/mx/results/resultparser';
import _ from 'lodash';
import {
  Dropdown,
  Anchor,
  Col,
  Container,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap';
import ReactSelect from 'react-select';

type Props = PropsWithChildren<{
  sessionId: string | undefined;
  proposalName: string | undefined;
}>;

export default function MXPage({
  children,
  sessionId = '',
  proposalName = '',
}: Props) {
  return (
    <>
      <SessionTabMenu
        sessionId={sessionId}
        proposalName={proposalName}
      ></SessionTabMenu>
      <SelectPipelinesSuspense
        sessionId={sessionId}
        proposalName={proposalName}
      />
      <SelectAutoprocRanking />
      {children}
    </>
  );
}

export function SelectAutoprocRanking() {
  const autoProcRankingSelection = useAutoProcRanking();

  return (
    <OverlayTrigger
      trigger={['click']}
      placement={'bottom'}
      rootClose
      overlay={
        <Popover>
          <Container style={{ padding: 20 }}>
            <Col>
              <strong>
                Autoprocessing results will be ranked based on the value of:
              </strong>
              <br></br>
              <label>Bin</label>
              <ReactSelect
                options={RESULT_RANK_SHELLS.map((v) => ({
                  value: v,
                  label: v,
                }))}
                value={{
                  value: autoProcRankingSelection.rankShell,
                  label: autoProcRankingSelection.rankShell,
                }}
                onChange={(v) =>
                  v && autoProcRankingSelection.setRankShell(v.value)
                }
              ></ReactSelect>
              <label>Parameter</label>
              <ReactSelect
                options={RESULT_RANK_PARAM.map((v) => ({
                  value: v,
                  label: v,
                }))}
                value={{
                  value: autoProcRankingSelection.rankParam,
                  label: autoProcRankingSelection.rankParam,
                }}
                onChange={(v) =>
                  v && autoProcRankingSelection.setRankParam(v.value)
                }
              ></ReactSelect>
            </Col>
          </Container>
        </Popover>
      }
    >
      <Dropdown.Toggle
        size="sm"
        variant="primary"
        style={{ marginRight: 2, marginLeft: 2 }}
      >
        Ranking
      </Dropdown.Toggle>
    </OverlayTrigger>
  );
}

export function SelectPipelinesSuspense({
  sessionId,
  proposalName,
}: {
  sessionId: string;
  proposalName: string;
}) {
  return (
    <Suspense fallback={<SelectPipelinesFallback />}>
      <SelectPipelines proposalName={proposalName} sessionId={sessionId} />
    </Suspense>
  );
}
function SelectPipelinesFallback() {
  return (
    <Dropdown>
      <Dropdown.Toggle
        disabled={true}
        size="sm"
        variant="primary"
        style={{ marginRight: 2, marginLeft: 2 }}
      >
        Select pipelines
      </Dropdown.Toggle>
    </Dropdown>
  );
}

function SelectPipelines({
  sessionId,
  proposalName,
}: {
  sessionId: string;
  proposalName: string;
}) {
  const { data: dataCollectionGroups } = useMXDataCollectionsBy({
    proposalName,
    sessionId,
  });
  const pipelinesSelection = usePipelines();
  const ids = (dataCollectionGroups || [])
    .map((d) => d.DataCollection_dataCollectionId)
    .slice(0, 10)
    .join(',');
  const { data } = useAutoProc({
    proposalName,
    dataCollectionId: ids ? ids : '-1',
  });

  if (data === undefined || !data.length) return <SelectPipelinesFallback />;
  const options = _(parseResults(data.flatMap((v) => v)))
    .map((v) => v.program)
    .uniq()
    .sort()
    .value();

  if (options.length === 0) return <SelectPipelinesFallback />;
  const allSelected = _(options).every((o) =>
    pipelinesSelection.pipelines.includes(o)
  );

  return (
    <Dropdown>
      <Dropdown.Toggle
        disabled={false}
        size="sm"
        variant="primary"
        style={{ marginRight: 2, marginLeft: 2 }}
      >
        Filter pipelines
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          as={Anchor}
          onClick={(e) => {
            if (allSelected) {
              pipelinesSelection.setPipelines([]);
            } else {
              pipelinesSelection.setPipelines(options);
            }
            e.stopPropagation();
          }}
        >
          <strong style={{ borderBottom: '1px solid black' }}>
            {allSelected ? 'Unselect all' : 'Select all'}
          </strong>
        </Dropdown.Item>
        {options.map((v) => (
          <Dropdown.Item
            key={v}
            as={Anchor}
            onClick={(e) => {
              if (pipelinesSelection.pipelines.includes(v)) {
                pipelinesSelection.setPipelines(
                  pipelinesSelection.pipelines.filter((e) => e !== v)
                );
              } else {
                pipelinesSelection.setPipelines([
                  ...pipelinesSelection.pipelines,
                  v,
                ]);
              }
              e.stopPropagation();
            }}
          >
            {pipelinesSelection.pipelines.includes(v) ? (
              <div>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ marginRight: 5 }}
                  color="green"
                ></FontAwesomeIcon>
                {v}
              </div>
            ) : (
              <div style={{ marginLeft: 21 }}>{v}</div>
            )}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
