import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MXPage from 'legacy/pages/mx/mxpage';
import {
  ButtonGroup,
  Card,
  OverlayTrigger,
  ToggleButton,
  Tooltip,
} from 'react-bootstrap';
import { useMXDataCollectionsBy } from 'legacy/hooks/ispyb';
import DataCollectionGroupPanel from 'legacy/pages/mx/datacollectiongroup/datacollectiongrouppanel';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import LoadingPanel from 'legacy/components/loading/loadingpanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Subject } from 'rxjs';
import _ from 'lodash';
import ContainerFilter from '../container/containerfilter';
import {
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

  if (dataCollectionGroups && dataCollectionGroups.length) {
    const containerIds = _(dataCollectionGroups)
      .map((dataCollectionGroup) => dataCollectionGroup?.Container_containerId)
      .uniq()
      .sort()
      .value();

    const filteredDataCollectionGroups = filterContainers
      ? dataCollectionGroups.filter(
          (g) =>
            g.DataCollection_dataCollectionGroupId &&
            selectedGroups.includes(g.DataCollection_dataCollectionGroupId)
        )
      : dataCollectionGroups;

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
              <div style={compact ? { margin: 1 } : { margin: 5 }}>
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <DataCollectionGroupPanel
                    compactToggle={compactToggle}
                    defaultCompact={compact}
                    dataCollectionGroup={dataCollectionGroup}
                    proposalName={proposalName}
                    sessionId={sessionId}
                  ></DataCollectionGroupPanel>
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
