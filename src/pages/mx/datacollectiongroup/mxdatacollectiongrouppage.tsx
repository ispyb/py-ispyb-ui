import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MXPage from 'pages/mx/mxpage';
import { ButtonGroup, Card, OverlayTrigger, ToggleButton, Tooltip } from 'react-bootstrap';
import { useMXDataCollectionsBy } from 'hooks/ispyb';
import DataCollectionGroupPanel from 'pages/mx/datacollectiongroup/datacollectiongrouppanel';
import { DataCollectionGroup } from 'pages/mx/model';
import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faListUl } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';

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
  return (
    <MXPage sessionId={sessionId} proposalName={proposalName}>
      <Card>
        <div style={{ position: 'relative', top: -39, height: 0, alignSelf: 'end' }}>
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
          <ButtonGroup>
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
        {dataCollectionGroups.map((dataCollectionGroup: DataCollectionGroup) => (
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
