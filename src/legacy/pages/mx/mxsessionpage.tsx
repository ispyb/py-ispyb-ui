import { Suspense } from 'react';
import {
  useAutoProc,
  useMXDataCollectionsBy,
  useMXEnergyScans,
  useMXFluorescenceSpectras,
} from 'legacy/hooks/ispyb';
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
  Nav,
  Spinner,
  Card,
  Row,
} from 'react-bootstrap';
import ReactSelect from 'react-select';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import Loading from 'components/Loading';
import NbBadge from 'legacy/components/nbBadge';

type Param = {
  sessionId: string | undefined;
  proposalName: string | undefined;
};

export default function MXSessionPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();

  return (
    <>
      <AutoprocParameters sessionId={sessionId} proposalName={proposalName} />
      <SessionTabMenu
        sessionId={sessionId}
        proposalName={proposalName}
      ></SessionTabMenu>
      <div
        style={{
          borderBottom: '1px solid lightgrey',
          borderLeft: '1px solid lightgrey',
          borderRight: '1px solid lightgrey',
          borderRadius: '0 0 10px 10px',
          padding: 10,
        }}
      >
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}

function SessionTabMenu({
  proposalName = '',
  sessionId = '',
}: {
  proposalName: string | undefined;
  sessionId: string | undefined;
}) {
  return (
    <Nav variant="tabs">
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/MX/${sessionId}/summary`}
        >
          Summary
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/MX/${sessionId}/collection`}
        >
          Data Collections{' '}
          <Suspense
            fallback={
              <Spinner
                size="sm"
                animation="border"
                style={{ marginLeft: 10 }}
              />
            }
          >
            <NbBadgeEndpoint
              endpoint={useMXDataCollectionsBy}
              sessionId={sessionId}
              proposalName={proposalName}
            />
          </Suspense>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/MX/${sessionId}/energy`}
        >
          Energy Scans{' '}
          <Suspense
            fallback={
              <Spinner
                size="sm"
                animation="border"
                style={{ marginLeft: 10 }}
              />
            }
          >
            <NbBadgeEndpoint
              endpoint={useMXEnergyScans}
              sessionId={sessionId}
              proposalName={proposalName}
            />
          </Suspense>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/MX/${sessionId}/xrf`}
        >
          Fluorescence Spectra{' '}
          <Suspense
            fallback={
              <Spinner
                size="sm"
                animation="border"
                style={{ marginLeft: 10 }}
              />
            }
          >
            <NbBadgeEndpoint
              endpoint={useMXFluorescenceSpectras}
              sessionId={sessionId}
              proposalName={proposalName}
            />
          </Suspense>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export function NbBadgeEndpoint({
  endpoint,
  sessionId,
  proposalName,
}: {
  endpoint: ({
    proposalName,
    sessionId,
  }: {
    proposalName: string;
    sessionId: string;
  }) => { data: any[] | undefined };
  sessionId: string;
  proposalName: string;
}) {
  const { data } = endpoint({ proposalName, sessionId });
  return <NbBadge value={data?.length} />;
}

export function AutoprocParameters({
  sessionId,
  proposalName,
}: {
  sessionId: string;
  proposalName: string;
}) {
  return (
    <Card style={{ padding: '1rem', marginBottom: '1rem' }}>
      <Row>
        <Col
          xs={'auto'}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <strong>
            <i>
              Select your preferred autoprocessing pipelines and ranking method:
            </i>
          </strong>
        </Col>
        <Col xs={'auto'}>
          <SelectPipelinesSuspense
            sessionId={sessionId}
            proposalName={proposalName}
          />
        </Col>
        <Col xs={'auto'}>
          <SelectAutoprocRanking />
        </Col>
      </Row>
    </Card>
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
        variant="outline-dark"
        style={{ marginRight: 2, marginLeft: 2 }}
      >
        Rank by {autoProcRankingSelection.rankShell.toLocaleLowerCase()}{' '}
        {autoProcRankingSelection.rankParam}
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
        No pipelines
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
        variant="outline-dark"
        style={{ marginRight: 2, marginLeft: 2 }}
      >
        {allSelected || pipelinesSelection.pipelines.length === 0
          ? 'All pipelines'
          : `Selected ${pipelinesSelection.pipelines.length} pipeline${
              pipelinesSelection.pipelines.length > 1 ? 's' : ''
            }`}
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
