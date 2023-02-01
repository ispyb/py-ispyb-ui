import { Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import MXPage from 'legacy/pages/mx/mxpage';
import {
  Anchor,
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  OverlayTrigger,
  ToggleButton,
  Tooltip,
} from 'react-bootstrap';
import { useAutoProc, useMXDataCollectionsBy } from 'legacy/hooks/ispyb';
import DataCollectionGroupPanel from 'legacy/pages/mx/datacollectiongroup/datacollectiongrouppanel';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import LoadingPanel from 'legacy/components/loading/loadingpanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Subject } from 'rxjs';
import _ from 'lodash';
import ContainerFilter from '../container/containerfilter';
import {
  faCheckCircle,
  faDotCircle,
  faFilePdf,
  faFileWord,
  faListAlt,
  faListUl,
} from '@fortawesome/free-solid-svg-icons';
import {
  getMXDataCollectionAnalysis,
  getMXDataCollectionSummary,
} from 'legacy/api/ispyb';
import DownloadOptions from 'legacy/components/buttons/downloadoptions';
import { parseResults } from 'legacy/helpers/mx/results/resultparser';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXDataCollectionGroupPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();
  const { data: dataCollectionGroups, isError } = useMXDataCollectionsBy({
    proposalName,
    sessionId,
  });
  if (isError) throw Error(isError);
  const [compact, setCompact] = useState(false);
  const compactToggle = new Subject<boolean>();
  const [filterContainers, setFilterContainers] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([] as number[]);
  const [selectedPipelines, setSelectedPipelines] = useState<string[]>([]);
  const [filterMR, setFilterMR] = useState(false);
  const [filterSAD, setFilterSAD] = useState(false);

  if (dataCollectionGroups && dataCollectionGroups.length) {
    const containerIds = _(dataCollectionGroups)
      .map((dataCollectionGroup) => dataCollectionGroup?.Container_containerId)
      .uniq()
      .sort()
      .value();

    const filteredDataCollectionGroupsByContainer = filterContainers
      ? dataCollectionGroups.filter(
          (g) =>
            g.DataCollection_dataCollectionGroupId &&
            selectedGroups.includes(g.DataCollection_dataCollectionGroupId)
        )
      : dataCollectionGroups;

    const filteredDataCollectionGroups =
      filteredDataCollectionGroupsByContainer.filter(
        (dcg) =>
          !(filterMR || filterSAD) ||
          (filterMR && dcg.SpaceGroupModelResolvedByMr) ||
          (filterSAD && dcg.SpaceGroupModelResolvedByPhasing)
      );

    return (
      <MXPage sessionId={sessionId} proposalName={proposalName}>
        <Card>
          <div
            style={{
              position: 'relative',
              top: -39,
              height: 0,
              alignSelf: 'flex-end',
            }}
          >
            <ButtonGroup style={{ marginRight: 50 }}>
              <DownloadOptions
                title="Summary"
                options={[
                  {
                    href: getMXDataCollectionSummary({
                      sessionId,
                      proposalName,
                      format: 'pdf',
                    }).url,
                    fileName: `Report_${proposalName}_${sessionId}.pdf`,
                    title: 'PDF',
                    icon: faFilePdf,
                  },
                  {
                    href: getMXDataCollectionSummary({
                      sessionId,
                      proposalName,
                      format: 'rtf',
                    }).url,
                    fileName: `Report_${proposalName}_${sessionId}.rtf`,
                    title: 'RTF',
                    icon: faFileWord,
                  },
                ]}
              ></DownloadOptions>
              <DownloadOptions
                title="Analysis"
                options={[
                  {
                    href: getMXDataCollectionAnalysis({
                      sessionId,
                      proposalName,
                      format: 'pdf',
                    }).url,
                    fileName: `AnalysisReport_${proposalName}_${sessionId}.pdf`,
                    title: 'PDF',
                    icon: faFilePdf,
                  },
                  {
                    href: getMXDataCollectionAnalysis({
                      sessionId,
                      proposalName,
                      format: 'rtf',
                    }).url,
                    fileName: `AnalysisReport_${proposalName}_${sessionId}.rtf`,
                    title: 'RTF',
                    icon: faFileWord,
                  },
                ]}
              ></DownloadOptions>
            </ButtonGroup>
            <ButtonGroup style={{ marginRight: 50 }}>
              <Suspense fallback={<SelectPipelinesFallback />}>
                <SelectPipelines
                  dataCollectionGroups={filteredDataCollectionGroups}
                  proposalName={proposalName}
                  selected={selectedPipelines}
                  setSelected={setSelectedPipelines}
                />
              </Suspense>
            </ButtonGroup>
            <ButtonGroup style={{ marginRight: 50 }}>
              <Button
                size="sm"
                variant={filterMR ? 'primary' : 'light'}
                onClick={() => setFilterMR(!filterMR)}
              >
                MR
              </Button>
              <Button
                size="sm"
                variant={filterSAD ? 'primary' : 'light'}
                onClick={() => setFilterSAD(!filterSAD)}
              >
                SAD
              </Button>
              <OverlayTrigger
                key={'bottom'}
                placement={'bottom'}
                overlay={
                  <Tooltip id={`tooltip-bottom`}>
                    Toggle sample filtering
                  </Tooltip>
                }
              >
                <ToggleButton
                  style={{ margin: 1 }}
                  size="sm"
                  type="checkbox"
                  variant={filterContainers ? 'outline-primary' : 'light'}
                  checked={filterContainers}
                  onClick={() => {
                    setFilterContainers(!filterContainers);
                  }}
                  value={''}
                >
                  <FontAwesomeIcon
                    style={{ marginRight: 5 }}
                    icon={faDotCircle}
                  ></FontAwesomeIcon>
                  Containers
                </ToggleButton>
              </OverlayTrigger>
            </ButtonGroup>
            <ButtonGroup>
              <OverlayTrigger
                key={'bottom'}
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
                key={'bottom'}
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
          {filterContainers && (
            <ContainerFilter
              setSelectedGroups={setSelectedGroups}
              dataCollectionGroups={dataCollectionGroups}
              selectedGroups={selectedGroups}
              containerIds={containerIds}
              sessionId={sessionId}
              proposalName={proposalName}
            ></ContainerFilter>
          )}
          {filteredDataCollectionGroups.map(
            (dataCollectionGroup: DataCollectionGroup) => (
              <div
                key={
                  dataCollectionGroup.DataCollectionGroup_dataCollectionGroupId
                }
                style={compact ? { margin: 1 } : { margin: 5 }}
              >
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                    <DataCollectionGroupPanel
                      compactToggle={compactToggle}
                      defaultCompact={compact}
                      dataCollectionGroup={dataCollectionGroup}
                      proposalName={proposalName}
                      sessionId={sessionId}
                      selectedPipelines={selectedPipelines}
                    ></DataCollectionGroupPanel>
                  </Suspense>
                </LazyWrapper>
              </div>
            )
          )}
        </Card>
      </MXPage>
    );
  }
  return (
    <MXPage sessionId={sessionId} proposalName={proposalName}>
      <Card>
        <p>No data collection groups found.</p>
      </Card>
    </MXPage>
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
  dataCollectionGroups,
  proposalName,
  selected,
  setSelected,
}: {
  dataCollectionGroups: DataCollectionGroup[];
  proposalName: string;
  selected: string[];
  setSelected: (_: string[]) => void;
}) {
  const ids = dataCollectionGroups
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
  const allSelected = _(options).every((o) => selected.includes(o));

  return (
    <Dropdown>
      <Dropdown.Toggle
        disabled={false}
        size="sm"
        variant="primary"
        style={{ marginRight: 2, marginLeft: 2 }}
      >
        Select pipelines
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          as={Anchor}
          onClick={(e) => {
            if (allSelected) {
              setSelected([]);
            } else {
              setSelected(options);
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
              if (selected.includes(v)) {
                setSelected(selected.filter((e) => e !== v));
              } else {
                setSelected([...selected, v]);
              }
              e.stopPropagation();
            }}
          >
            {selected.includes(v) ? (
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
