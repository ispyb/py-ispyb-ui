import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  ButtonGroup,
  OverlayTrigger,
  ToggleButton,
  Tooltip,
} from 'react-bootstrap';
import {
  useMXDataCollectionsBy,
  useMXEnergyScans,
  useMXFluorescenceSpectras,
} from 'legacy/hooks/ispyb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import ContainerFilter from '../../container/containerfilter';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { usePersistentParamState } from 'hooks/useParam';
import { parseDate } from 'helpers/dateparser';
import {
  DataCollectionGroup,
  EnergyScan,
  FluorescenceSpectra,
} from '../../model';
import { AcquisitionPanel } from '../../dataset/AcquisitionPanel';

type Param = {
  sessionId: string;
  proposalName: string;
};

export function MXAcquisitionsPage() {
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
            alignSelf: 'flex-start',
          }}
        >
          <small style={{ margin: 10 }}>
            <i>
              <strong>Filter by:</strong>
            </i>
          </small>
          <ButtonGroup>
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
          return (
            <AcquisitionPanel
              key={i}
              acquisition={acquisition}
              proposalName={proposalName}
              sessionId={sessionId}
            />
          );
        })}
      </div>
    );
  }
  return <Alert variant="info">No acquisition found.</Alert>;
}
