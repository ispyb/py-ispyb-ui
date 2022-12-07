import {
  faCheckDouble,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import LoadingPanel from 'legacy/components/loading/loadingpanel';
import { Suspense, useState } from 'react';
import {
  Row,
  Col,
  ButtonGroup,
  OverlayTrigger,
  ToggleButton,
  Tooltip,
} from 'react-bootstrap';
import { DataCollectionGroup } from '../model';
import { MXContainer } from './mxcontainer';

export default function ContainerFilter({
  proposalName,
  sessionId,
  setSelectedGroups = () => undefined,
  selectedGroups = [],
  containerIds,
  dataCollectionGroups,
}: {
  containerIds: (number | undefined)[];
  proposalName: string;
  sessionId: string;
  selectedGroups?: number[];
  // eslint-disable-next-line no-unused-vars
  setSelectedGroups?: (ids: number[]) => void;
  dataCollectionGroups: DataCollectionGroup[];
}) {
  const [selectMultiple, setSelectMultiple] = useState(false);

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
    <Col>
      <Row>
        <Col style={{ display: 'flex', margin: 20 }}>
          <ButtonGroup style={{ display: 'flex', margin: 'auto' }}>
            <OverlayTrigger
              key={'bottom'}
              placement={'bottom'}
              overlay={
                <Tooltip id={`tooltip-bottom`}>
                  Toggle multiple selection
                </Tooltip>
              }
            >
              <ToggleButton
                style={{ margin: 1 }}
                type="checkbox"
                variant={selectMultiple ? 'outline-primary' : 'light'}
                checked={true}
                onClick={() => {
                  if (selectMultiple) {
                    setSelectedGroups([]);
                  }
                  setSelectMultiple(!selectMultiple);
                }}
                value={''}
              >
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  icon={faCheckDouble}
                ></FontAwesomeIcon>
                Multiple selection
              </ToggleButton>
            </OverlayTrigger>
            <OverlayTrigger
              key={'bottom'}
              placement={'bottom'}
              overlay={<Tooltip id={`tooltip-bottom`}>Select all</Tooltip>}
            >
              <ToggleButton
                style={{ margin: 1 }}
                type="checkbox"
                variant={'light'}
                checked={true}
                onClick={() => {
                  setSelectMultiple(true);
                  setSelectedGroups(
                    dataCollectionGroups
                      .filter((g) => Boolean(g.Container_containerId))
                      .map(
                        (g) => g.DataCollectionGroup_dataCollectionGroupId || 0
                      )
                  );
                }}
                value={''}
              >
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  icon={faCheckCircle}
                ></FontAwesomeIcon>
                Select all
              </ToggleButton>
            </OverlayTrigger>
            <OverlayTrigger
              key={'bottom'}
              placement={'bottom'}
              overlay={<Tooltip id={`tooltip-bottom`}>Unselect all</Tooltip>}
            >
              <ToggleButton
                style={{ margin: 1 }}
                type="checkbox"
                variant={'light'}
                checked={true}
                onClick={() => {
                  setSelectedGroups([]);
                }}
                value={''}
              >
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  icon={faTimesCircle}
                ></FontAwesomeIcon>
                Unselect all
              </ToggleButton>
            </OverlayTrigger>
          </ButtonGroup>
        </Col>
      </Row>
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
    </Col>
  );
}
