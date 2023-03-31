import { Suspense, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  OverlayTrigger,
  ToggleButton,
  Tooltip,
} from 'react-bootstrap';
import {
  useMXDataCollectionsBy,
  useMXEnergyScans,
  useMXFluorescenceSpectras,
} from 'legacy/hooks/ispyb';
import DataCollectionGroupPanel from 'legacy/pages/mx/datacollectiongroup/datacollectiongrouppanel';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import LoadingPanel from 'legacy/components/loading/loadingpanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Subject } from 'rxjs';
import _ from 'lodash';
import ContainerFilter from '../container/containerfilter';
import {
  faDotCircle,
  faListAlt,
  faListUl,
} from '@fortawesome/free-solid-svg-icons';
import { useAutoProcRanking, usePipelines } from 'hooks/mx';
import { usePersistentParamState } from 'hooks/useParam';
import { parseDate } from 'helpers/dateparser';
import EnergyScanPanel from '../energyscan/energyscanpanel';
import FluorescencePanel from '../fluorescence/fluorescencepanel';
import { DataCollectionGroup, EnergyScan, FluorescenceSpectra } from '../model';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXDataCollectionGroupPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();
  const { data: dataCollectionGroups } = useMXDataCollectionsBy({
    proposalName,
    sessionId,
  });
  const { data: spectras } = useMXFluorescenceSpectras({
    proposalName,
    sessionId,
  });
  const { data: energyScans } = useMXEnergyScans({
    proposalName,
    sessionId,
  });

  const [compact, setCompact] = useState(false);
  const compactToggle = new Subject<boolean>();

  const [filterSamples, setFilterSamples] = usePersistentParamState<
    'true' | 'false'
  >('filterSamples', 'false');

  const [selectedSamples, setSelectedSamples] = usePersistentParamState<string>(
    'samples',
    'all'
  );
  const [filterMR, setFilterMR] = usePersistentParamState<'true' | 'false'>(
    'filterMR',
    'false'
  );
  const [filterSAD, setFilterSAD] = usePersistentParamState<'true' | 'false'>(
    'filterSAD',
    'false'
  );
  const [filterScaling, setFilterScaling] = usePersistentParamState<
    'true' | 'false'
  >('filterScaling', 'false');

  const pipelinesSelection = usePipelines();
  const autoProcRankingSelection = useAutoProcRanking();

  const containerIds = useMemo(() => {
    return _(dataCollectionGroups)
      .map((dataCollectionGroup) => dataCollectionGroup?.Container_containerId)
      .uniq()
      .sort()
      .value();
  }, [dataCollectionGroups]);

  const filteredDataCollectionGroups = useMemo(() => {
    if (!dataCollectionGroups) return [];
    const filteredDataCollectionGroupsByContainer =
      filterSamples === 'true'
        ? dataCollectionGroups.filter(
            (g) =>
              g.BLSample_name &&
              selectedSamples.split(',').includes(g.BLSample_name)
          )
        : dataCollectionGroups;

    return filteredDataCollectionGroupsByContainer.filter(
      (dcg) =>
        !(
          filterMR === 'true' ||
          filterSAD === 'true' ||
          filterScaling === 'true'
        ) ||
        (filterMR === 'true' && dcg.SpaceGroupModelResolvedByMr) ||
        (filterSAD === 'true' && dcg.SpaceGroupModelResolvedByPhasing) ||
        (filterScaling === 'true' && dcg.scalingStatisticsTypes)
    );
  }, [
    dataCollectionGroups,
    filterMR,
    filterSAD,
    filterScaling,
    filterSamples,
    selectedSamples,
  ]);

  const acquisitionData = useMemo(() => {
    const onlyDataCollectionGroups =
      filterMR === 'true' ||
      filterSAD === 'true' ||
      filterScaling === 'true' ||
      filterSamples === 'true';
    const spectraList = onlyDataCollectionGroups ? [] : spectras || [];
    const energyScanList = onlyDataCollectionGroups ? [] : energyScans || [];
    return _([...(filteredDataCollectionGroups || [])] as (
      | DataCollectionGroup
      | FluorescenceSpectra
      | EnergyScan
    )[])
      .push(...energyScanList)
      .push(...spectraList)
      .orderBy((v) => {
        const start =
          'startTime' in v ? v.startTime : v.DataCollectionGroup_startTime;
        if (!start) return new Date().getTime();
        return parseDate(start).getTime();
      })
      .reverse()
      .value();
  }, [
    filterMR,
    filterSAD,
    filterScaling,
    filterSamples,
    spectras,
    energyScans,
    filteredDataCollectionGroups,
  ]);

  if (dataCollectionGroups && dataCollectionGroups.length) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            alignSelf: 'flex-end',
          }}
        >
          <small style={{ marginRight: 10 }}>
            <i>
              <strong>Filter by:</strong>
            </i>
          </small>
          <ButtonGroup style={{ marginRight: 50 }}>
            <Button
              size="sm"
              variant={filterScaling === 'true' ? 'primary' : 'light'}
              onClick={() =>
                setFilterScaling(filterScaling === 'true' ? 'false' : 'true')
              }
            >
              Scaling
            </Button>
            <Button
              size="sm"
              variant={filterMR === 'true' ? 'primary' : 'light'}
              onClick={() =>
                setFilterMR(filterMR === 'true' ? 'false' : 'true')
              }
            >
              MR
            </Button>
            <Button
              size="sm"
              variant={filterSAD === 'true' ? 'primary' : 'light'}
              onClick={() =>
                setFilterSAD(filterSAD === 'true' ? 'false' : 'true')
              }
            >
              SAD
            </Button>
            <OverlayTrigger
              placement={'bottom'}
              overlay={
                <Tooltip id={`tooltip-bottom`}>Toggle sample filtering</Tooltip>
              }
            >
              <ToggleButton
                style={{ margin: 1 }}
                size="sm"
                type="checkbox"
                variant={filterSamples === 'true' ? 'outline-primary' : 'light'}
                checked={filterSamples === 'true'}
                onClick={() => {
                  setFilterSamples(filterSamples === 'true' ? 'false' : 'true');
                }}
                value={''}
              >
                <FontAwesomeIcon
                  style={{ marginRight: 5 }}
                  icon={faDotCircle}
                ></FontAwesomeIcon>
                Sample
              </ToggleButton>
            </OverlayTrigger>
          </ButtonGroup>
          <ButtonGroup>
            <OverlayTrigger
              placement={'bottom'}
              overlay={
                <Tooltip id={`tooltip-bottom`}>Use detailed view</Tooltip>
              }
            >
              <ToggleButton
                style={{ margin: 1 }}
                size="sm"
                type="checkbox"
                variant={!compact ? 'outline-primary' : 'light'}
                name="radio"
                checked={!compact}
                onClick={() => {
                  setCompact(false);
                  compactToggle.next(false);
                }}
                value={''}
              >
                <FontAwesomeIcon icon={faListAlt}></FontAwesomeIcon>
              </ToggleButton>
            </OverlayTrigger>

            <OverlayTrigger
              placement={'bottom'}
              overlay={
                <Tooltip id={`tooltip-bottom`}>Use compact view</Tooltip>
              }
            >
              <ToggleButton
                style={{ margin: 1 }}
                size="sm"
                type="checkbox"
                variant={compact ? 'outline-primary' : 'light'}
                name="radio"
                checked={compact}
                onClick={() => {
                  setCompact(true);
                  compactToggle.next(true);
                }}
                value={''}
              >
                <FontAwesomeIcon icon={faListUl}></FontAwesomeIcon>
              </ToggleButton>
            </OverlayTrigger>
          </ButtonGroup>
        </div>
        {filterSamples === 'true' && (
          <ContainerFilter
            setSelectedSamples={setSelectedSamples}
            dataCollectionGroups={dataCollectionGroups}
            selectedSamples={selectedSamples}
            containerIds={containerIds}
            sessionId={sessionId}
            proposalName={proposalName}
          ></ContainerFilter>
        )}
        {acquisitionData.map((acquisition, i) => {
          if ('DataCollectionGroup_dataCollectionGroupId' in acquisition) {
            return (
              <div
                key={acquisition.DataCollectionGroup_dataCollectionGroupId}
                style={compact ? { margin: 1 } : { margin: 5 }}
              >
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                    <DataCollectionGroupPanel
                      compactToggle={compactToggle}
                      defaultCompact={compact}
                      dataCollectionGroup={acquisition}
                      proposalName={proposalName}
                      sessionId={sessionId}
                      selectedPipelines={pipelinesSelection.pipelines}
                      resultRankParam={autoProcRankingSelection.rankParam}
                      resultRankShell={autoProcRankingSelection.rankShell}
                    ></DataCollectionGroupPanel>
                  </Suspense>
                </LazyWrapper>
              </div>
            );
          } else if ('xfeFluorescenceSpectrumId' in acquisition) {
            return (
              <div
                key={acquisition.xfeFluorescenceSpectrumId}
                style={{ margin: 5 }}
              >
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                    <FluorescencePanel
                      spectra={acquisition}
                      proposalName={proposalName}
                      sessionId={sessionId}
                    ></FluorescencePanel>
                  </Suspense>
                </LazyWrapper>
              </div>
            );
          } else if ('scanFileFullPath' in acquisition) {
            return (
              <div key={acquisition.scanFileFullPath} style={{ margin: 5 }}>
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                    <EnergyScanPanel
                      energyScan={acquisition}
                      proposalName={proposalName}
                      sessionId={sessionId}
                    ></EnergyScanPanel>
                  </Suspense>
                </LazyWrapper>
              </div>
            );
          } else {
            return (
              <div key={i} style={{ margin: 5 }}>
                <Alert variant="danger">Unknown acquisition type</Alert>
              </div>
            );
          }
        })}
      </div>
    );
  }
  return (
    <Card>
      <p>No data collection groups found.</p>
    </Card>
  );
}
