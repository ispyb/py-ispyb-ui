import { Suspense, useEffect, useMemo, useState } from 'react';
import {
  useMXDataCollectionsBy,
  useMXEnergyScans,
  useMXFluorescenceSpectras,
} from 'legacy/hooks/ispyb';
import { useAutoProcRanking, usePipelines } from 'hooks/mx';
import {
  faAngleDown,
  faAngleUp,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AUTOPROC_RANKING_METHOD_DESCRIPTION,
  getRankingOrder,
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
  Button,
} from 'react-bootstrap';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import Loading from 'components/Loading';
import NbBadge from 'legacy/components/nbBadge';
import { useInView } from 'react-intersection-observer';

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
          Acquisitions{' '}
          <Suspense
            fallback={
              <Spinner
                size="sm"
                animation="border"
                style={{ marginLeft: 10 }}
              />
            }
          >
            <NbBadgeAcquisition
              sessionId={sessionId}
              proposalName={proposalName}
            />
          </Suspense>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export function NbBadgeAcquisition({
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
  const nonEmptyDataCollectionGroups = useMemo(() => {
    return dataCollectionGroups?.filter(
      (dataCollectionGroup) =>
        dataCollectionGroup.DataCollection_dataCollectionId !== undefined
    );
  }, [dataCollectionGroups]);

  const { data: spectras } = useMXFluorescenceSpectras({
    proposalName,
    sessionId,
  });
  const { data: energyScans } = useMXEnergyScans({
    proposalName,
    sessionId,
  });

  const data = useMemo(() => {
    return [
      ...(nonEmptyDataCollectionGroups || []),
      ...(spectras || []),
      ...(energyScans || []),
    ];
  }, [nonEmptyDataCollectionGroups, spectras, energyScans]);

  return <NbBadge value={data?.length} />;
}

export function AutoprocParameters({
  sessionId,
  proposalName,
}: {
  sessionId: string;
  proposalName: string;
}) {
  const ranking = useAutoProcRanking();
  const { ref, inView } = useInView({
    rootMargin: '0px 0px',
    triggerOnce: false,
  });
  const selector = (
    <div>
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
      <Row>
        <small>
          <i>
            {AUTOPROC_RANKING_METHOD_DESCRIPTION.map((line, i) => {
              const text =
                i === AUTOPROC_RANKING_METHOD_DESCRIPTION.length - 1
                  ? line +
                    ` (${
                      getRankingOrder(ranking.rankParam) === 1
                        ? 'lowest'
                        : 'highest'
                    } ${ranking.rankShell.toLocaleLowerCase()} ${
                      ranking.rankParam
                    })`
                  : line;
              return (
                <div key={text}>
                  {text} <br />
                </div>
              );
            })}
          </i>
        </small>
      </Row>
    </div>
  );

  const [expandHoveringSelector, setExpandHoveringSelector] = useState(false);

  useEffect(() => {
    if (inView) {
      setExpandHoveringSelector(false);
    }
  }, [inView]);

  const hoveringSelector = (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 30,
        width: 300,
        display: inView ? 'none' : 'block',
        zIndex: 1000,
        cursor: 'pointer',
      }}
      onClick={() => setExpandHoveringSelector(!expandHoveringSelector)}
    >
      <Card
        style={{
          padding: '0.5rem',
          marginBottom: '1rem',
          backgroundColor: '#cedbf3',
        }}
      >
        <Row>
          <Col xs={'auto'}>
            <FontAwesomeIcon
              icon={expandHoveringSelector ? faAngleDown : faAngleUp}
            />
          </Col>
          <Col
            xs={'auto'}
            style={{
              display: expandHoveringSelector ? undefined : 'none',
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ cursor: 'default' }}
            >
              {selector}
            </div>
          </Col>
          <Col
            style={{
              display: expandHoveringSelector ? 'none' : 'flex',
              alignItems: 'center',
            }}
          >
            <i>
              <strong>Select pipelines and ranking</strong>
            </i>
          </Col>
        </Row>
      </Card>
    </div>
  );

  return (
    <Card
      ref={ref}
      style={{
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#cedbf3',
      }}
    >
      {selector}
      {hoveringSelector}
    </Card>
  );
}

export function SelectAutoprocRanking() {
  const autoProcRankingSelection = useAutoProcRanking();

  return (
    <OverlayTrigger
      trigger={['click']}
      placement={'auto'}
      rootClose
      overlay={
        <Popover>
          <Container style={{ padding: 20 }}>
            <Col>
              <Row>
                <i>
                  Autoprocessing results will be ranked based on the value of:
                </i>
              </Row>
              <Row style={{ padding: 10 }}>
                <div style={{ borderBottom: '1px solid grey' }} />
              </Row>
              <Row>
                <strong>Parameter</strong>
              </Row>
              <Row>
                {RESULT_RANK_PARAM.map((v) => (
                  <Col xs={'auto'} key={v} style={{ padding: 10 }}>
                    <Button
                      variant={
                        autoProcRankingSelection.rankParam === v
                          ? 'primary'
                          : 'outline-primary'
                      }
                      onClick={() => autoProcRankingSelection.setRankParam(v)}
                      size={'sm'}
                      key={v}
                    >
                      {v}
                    </Button>
                  </Col>
                ))}
              </Row>
              <Row style={{ padding: 10 }}>
                <div style={{ borderBottom: '1px solid grey' }} />
              </Row>
              <Row>
                <strong>Bin</strong>
              </Row>
              <Row>
                {RESULT_RANK_SHELLS.map((v) => (
                  <Col key={v} xs={'auto'} style={{ padding: 10 }}>
                    <Button
                      variant={
                        autoProcRankingSelection.rankShell === v
                          ? 'primary'
                          : 'outline-primary'
                      }
                      onClick={() => autoProcRankingSelection.setRankShell(v)}
                      size={'sm'}
                      key={v}
                    >
                      {v}
                    </Button>
                  </Col>
                ))}
              </Row>
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
        Rank by{' '}
        {getRankingOrder(autoProcRankingSelection.rankParam) === 1
          ? 'lowest'
          : 'highest'}{' '}
        {autoProcRankingSelection.rankShell.toLocaleLowerCase()}{' '}
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

  const options = _(dataCollectionGroups || [])
    .map((dcg) => dcg.processingPrograms || '')
    .flatMap((programs) => programs.split(','))
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
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
