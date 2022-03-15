import React, { Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import MXPage from 'pages/mx/mxpage';
import { ButtonGroup, Card, Col, OverlayTrigger, Row, ToggleButton, Tooltip } from 'react-bootstrap';
import { useMXDataCollectionsBy } from 'hooks/ispyb';
import DataCollectionGroupPanel from 'pages/mx/datacollectiongroup/datacollectiongrouppanel';
import { DataCollectionGroup } from 'pages/mx/model';
import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCheckDouble, faListAlt, faListUl, faTimesCircle, faVial } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import _ from 'lodash';
import { MXContainer } from '../container/mxcontainer';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXDataCollectionGroupPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();
  const { data: dataCollectionGroups, isError } = useMXDataCollectionsBy({ proposalName, sessionId });
  if (isError) throw Error(isError);
  const [compact, setCompact] = useState(false);
  const compactToggle = new Subject<boolean>();
  const [filterContainers, setFilterContainers] = useState(false);
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([] as number[]);

  if (dataCollectionGroups && dataCollectionGroups.length) {
    const containerIds = _(dataCollectionGroups)
      .map((dataCollectionGroup) => dataCollectionGroup?.Container_containerId)
      .uniq()
      .sort()
      .value();

    const filteredDataCollectionGroups = filterContainers
      ? dataCollectionGroups.filter((g) => g.DataCollection_dataCollectionGroupId && selectedGroups.includes(g.DataCollection_dataCollectionGroupId))
      : dataCollectionGroups;

    const addSelectedGroups = (ids: number[]) => {
      const newSelected = selectMultiple ? selectedGroups.slice() : [];
      newSelected.push(...ids);
      setSelectedGroups(newSelected);
    };

    const removeSelectedGroups = (ids: number[]) => {
      if (selectMultiple) {
        const newSelected = selectedGroups.slice();
        for (const i of ids) {
          newSelected.splice(newSelected.indexOf(i), 1);
        }
        setSelectedGroups(newSelected);
      } else {
        setSelectedGroups([]);
      }
    };

    return (
      <MXPage sessionId={sessionId} proposalName={proposalName}>
        <Card>
          <div style={{ position: 'relative', top: -39, height: 0, alignSelf: 'end' }}>
            <ButtonGroup style={{ marginRight: 50 }}>
              <OverlayTrigger key={'bottom'} placement={'bottom'} overlay={<Tooltip id={`tooltip-bottom`}>Toggle sample filtering</Tooltip>}>
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
                  <FontAwesomeIcon icon={faVial}></FontAwesomeIcon>
                </ToggleButton>
              </OverlayTrigger>
              <OverlayTrigger key={'bottom'} placement={'bottom'} overlay={<Tooltip id={`tooltip-bottom`}>Toggle multiple selection</Tooltip>}>
                <ToggleButton
                  style={{ margin: 1 }}
                  size="sm"
                  type="checkbox"
                  variant={filterContainers && selectMultiple ? 'outline-primary' : 'light'}
                  checked={true}
                  disabled={!filterContainers}
                  onClick={() => {
                    if (selectMultiple) {
                      setSelectedGroups([]);
                    }
                    setSelectMultiple(!selectMultiple);
                  }}
                  value={''}
                >
                  <FontAwesomeIcon icon={faCheckDouble}></FontAwesomeIcon>
                </ToggleButton>
              </OverlayTrigger>
              <OverlayTrigger key={'bottom'} placement={'bottom'} overlay={<Tooltip id={`tooltip-bottom`}>Select all</Tooltip>}>
                <ToggleButton
                  style={{ margin: 1 }}
                  size="sm"
                  type="checkbox"
                  variant={'light'}
                  checked={true}
                  disabled={!filterContainers}
                  onClick={() => {
                    setSelectMultiple(true);
                    setSelectedGroups(dataCollectionGroups.filter((g) => Boolean(g.Container_containerId)).map((g) => g.DataCollectionGroup_dataCollectionGroupId || 0));
                  }}
                  value={''}
                >
                  <FontAwesomeIcon icon={faCheckCircle}></FontAwesomeIcon>
                </ToggleButton>
              </OverlayTrigger>
              <OverlayTrigger key={'bottom'} placement={'bottom'} overlay={<Tooltip id={`tooltip-bottom`}>Unselect all</Tooltip>}>
                <ToggleButton
                  style={{ margin: 1 }}
                  size="sm"
                  type="checkbox"
                  variant={'light'}
                  checked={true}
                  disabled={!filterContainers}
                  onClick={() => {
                    setSelectedGroups([]);
                  }}
                  value={''}
                >
                  <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
                </ToggleButton>
              </OverlayTrigger>
            </ButtonGroup>
            <ButtonGroup>
              <OverlayTrigger key={'bottom'} placement={'bottom'} overlay={<Tooltip id={`tooltip-bottom`}>Use detailed view</Tooltip>}>
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

              <OverlayTrigger key={'bottom'} placement={'bottom'} overlay={<Tooltip id={`tooltip-bottom`}>Use compact view</Tooltip>}>
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
            <Row style={{ margin: 10 }}>
              {containerIds.map((id) => {
                return (
                  id && (
                    <Col>
                      <LazyWrapper>
                        <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                          <MXContainer
                            addSelectedGroups={addSelectedGroups}
                            removeSelectedGroups={removeSelectedGroups}
                            selectedGroups={selectedGroups}
                            containerId={String(id)}
                            sessionId={sessionId}
                            proposalName={proposalName}
                          ></MXContainer>
                        </Suspense>
                      </LazyWrapper>
                    </Col>
                  )
                );
              })}
            </Row>
          )}
          {filteredDataCollectionGroups.map((dataCollectionGroup: DataCollectionGroup) => (
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
          ))}
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
