import {
  faCheckDouble,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import _ from 'lodash';
import { useState } from 'react';
import {
  Row,
  Col,
  ButtonGroup,
  OverlayTrigger,
  ToggleButton,
  Tooltip,
  Container,
} from 'react-bootstrap';
import { DataCollectionGroup } from '../model';
import { MXContainer } from './mxcontainer';

export default function ContainerFilter({
  proposalName,
  sessionId,
  setSelectedSamples = () => undefined,
  selectedSamples = 'all',
  containerIds,
  dataCollectionGroups,
}: {
  containerIds: (number | undefined)[];
  proposalName: string;
  sessionId: string;
  selectedSamples?: string;
  // eslint-disable-next-line no-unused-vars
  setSelectedSamples?: (v: string) => void;
  dataCollectionGroups: DataCollectionGroup[];
}) {
  const [selectMultiple, setSelectMultiple] = useState(false);

  const addSelectedSample = (name: string) => {
    const newSelected = selectMultiple ? selectedSamples.split(',') : [];
    newSelected.push(name);
    setSelectedSamples(newSelected.filter((s) => s !== 'all').join(','));
  };

  const removeSelectedSample = (name: string) => {
    if (selectMultiple) {
      const newSelected = selectedSamples.split(',').filter((s) => s !== name);
      setSelectedSamples(newSelected.join(','));
    } else {
      setSelectedSamples('all');
    }
  };

  return (
    <Col>
      <Row>
        <Col style={{ display: 'flex', margin: 20 }}>
          <ButtonGroup style={{ display: 'flex', margin: 'auto' }}>
            <OverlayTrigger
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
                    setSelectedSamples('all');
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
                  setSelectedSamples(
                    dataCollectionGroups
                      .filter((g) => g.BLSample_name !== undefined)
                      .map((g) => g.BLSample_name)
                      .join(',') || 'all'
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
              placement={'bottom'}
              overlay={<Tooltip id={`tooltip-bottom`}>Unselect all</Tooltip>}
            >
              <ToggleButton
                style={{ margin: 1 }}
                type="checkbox"
                variant={'light'}
                checked={true}
                onClick={() => {
                  setSelectedSamples('all');
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
        {_(containerIds)
          .sortBy((c) => c)
          .map((c) => {
            return (
              c && (
                <Col>
                  <LazyWrapper>
                    <Container fluid>
                      <MXContainer
                        onSampleClick={(s) => {
                          const isSelected = selectedSamples
                            .split(',')
                            .includes(s.BLSample_name);
                          if (isSelected) {
                            removeSelectedSample(s.BLSample_name);
                          } else {
                            addSelectedSample(s.BLSample_name);
                          }
                        }}
                        selectedSamples={selectedSamples.split(',')}
                        containerId={c.toString()}
                        sessionId={sessionId}
                        proposalName={proposalName}
                      ></MXContainer>
                    </Container>
                  </LazyWrapper>
                </Col>
              )
            );
          })
          .value()}
      </Row>
    </Col>
  );
}
