import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import EMPage from 'legacy/pages/em/empage';
import {
  Accordion,
  Container,
  Row,
  Col,
  Form,
  Alert,
  Button,
} from 'react-bootstrap';
import {
  useEMClassification,
  useEMDataCollectionsBy,
} from 'legacy/hooks/ispyb';
import { Classification } from 'legacy/pages/em/model';
import ClassificationPanel from 'legacy/pages/em/classification/classificationpanel';
import { useDataCollectionToGridSquares } from '../helper';
import { usePersistentParamState } from 'hooks/useParam';

type Param = {
  sessionId?: string;
  proposalName: string;
};

export default function SessionClassificationPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();

  const proposal: string = proposalName ? proposalName : '';
  const { data: classifications } = useEMClassification({
    sessionId,
    proposalName: proposal,
  });
  const dataCollectionResponse = useEMDataCollectionsBy({
    proposalName,
    sessionId,
  });
  const sampleList = useDataCollectionToGridSquares(
    dataCollectionResponse.data || [],
    proposalName
  );
  const [grid] = usePersistentParamState<string>('grid', 'all');
  const filteredSampleList = useMemo(
    () =>
      sampleList.filter(
        (sample) => grid === 'all' || sample.sampleName === grid
      ),
    [sampleList, grid]
  );

  const data = useMemo(
    () =>
      (classifications || []).filter(
        (cls) =>
          grid === 'all' ||
          filteredSampleList.some((sample) =>
            //need to filter by imageDirectory because not information on sample or datacollection from classification API
            sample.grids.some((g) => g.imageDirectory === cls.imageDirectory)
          )
      ),
    [classifications, grid, filteredSampleList]
  );

  const resolutions = data.map((d: Classification) => d.estimatedResolution);
  const maxCutoff = Math.max(...resolutions);
  const minCutoff = Math.min(...resolutions);

  const [selectedMinCutoff, setSelectedMinCutoff] = useState<number>(minCutoff);
  useEffect(() => {
    setSelectedMinCutoff(minCutoff);
  }, [minCutoff]);

  const [selectedMaxCutoff, setSelectedMaxCutoff] = useState<number>(maxCutoff);
  useEffect(() => {
    setSelectedMaxCutoff(maxCutoff);
  }, [maxCutoff]);

  const classificationGroupsId = new Set(
    data.map((d: Classification) => d.particleClassificationGroupId)
  );
  const groups: Classification[][] = [];
  classificationGroupsId.forEach((id) => {
    groups.push(
      data.filter(
        (d: Classification) =>
          d.particleClassificationGroupId === id &&
          d.estimatedResolution <= selectedMaxCutoff &&
          d.estimatedResolution >= selectedMinCutoff
      )
    );
  });

  if (!data || !data.length)
    return (
      <EMPage sessionId={sessionId} proposalName={proposalName}>
        <Alert style={{ margin: '1rem' }} variant="info">
          No classification found
        </Alert>
      </EMPage>
    );

  return (
    <EMPage sessionId={sessionId} proposalName={proposalName}>
      <Col>
        <CutOffResolutionSlider
          minCutoff={minCutoff}
          maxCutoff={maxCutoff}
          selectedMinCutoff={selectedMinCutoff}
          selectedMaxCutoff={selectedMaxCutoff}
          setSelectedMinCutoff={setSelectedMinCutoff}
          setSelectedMaxCutoff={setSelectedMaxCutoff}
        />
      </Col>
      <div style={{ margin: 10 }}>
        <Accordion>
          {groups.map((group, i) => (
            <Accordion.Item key={i} eventKey={i.toString()}>
              <Accordion.Header>
                <span>
                  Classification #{i + 1}: {group.length} classes{' '}
                  {group[0] ? `(${group[0].numberOfParticles} particles)` : ''}
                </span>
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  {group
                    .sort((a: Classification, b: Classification) => {
                      return b.classDistribution - a.classDistribution;
                    })
                    .map((c, i) => (
                      <Col
                        key={i}
                        xs={12}
                        sm={6}
                        lg={4}
                        xl={3}
                        xxl={2}
                        style={{
                          padding: '0.5rem',
                        }}
                      >
                        <ClassificationPanel
                          classification={c}
                          proposalName={proposalName}
                        ></ClassificationPanel>
                      </Col>
                    ))}
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </EMPage>
  );
}

const dragImg = document.createElement('img');
dragImg.src =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function CutOffResolutionSlider({
  minCutoff,
  maxCutoff,
  selectedMinCutoff,
  selectedMaxCutoff,
  setSelectedMinCutoff,
  setSelectedMaxCutoff,
}: {
  minCutoff: number;
  maxCutoff: number;
  selectedMinCutoff: number;
  selectedMaxCutoff: number;
  setSelectedMinCutoff: (value: number) => void;
  setSelectedMaxCutoff: (value: number) => void;
}) {
  const range = maxCutoff - minCutoff;
  const minCutoffPercent = ((selectedMinCutoff - minCutoff) / range) * 100;
  const maxCutoffPercent = ((selectedMaxCutoff - minCutoff) / range) * 100;

  const [moving, setMoving] = useState<'min' | 'max' | null>(null);

  const [minCutoffText, setMinCutoffText] = useState(
    selectedMinCutoff.toString()
  );
  const [maxCutoffText, setMaxCutoffText] = useState(
    selectedMaxCutoff.toString()
  );
  useEffect(() => {
    if (selectedMinCutoff === minCutoff) {
      setMinCutoffText(selectedMinCutoff.toString());
    }
  }, [selectedMinCutoff, minCutoff]);
  useEffect(() => {
    if (selectedMaxCutoff === maxCutoff) {
      setMaxCutoffText(selectedMaxCutoff.toString());
    }
  }, [selectedMaxCutoff, maxCutoff]);

  const handleMove = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!moving) return;
    const parent = e.currentTarget as HTMLElement;
    const rect = parent.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    const correctedPercent = percent < 0 ? 0 : percent > 100 ? 100 : percent;
    const value = minCutoff + (range * correctedPercent) / 100;
    if (moving === 'min') {
      const fixedValue =
        value === minCutoff ? minCutoff : parseFloat(value.toFixed(2));
      if (isValid(fixedValue, 'min')) {
        setMinCutoffText(fixedValue.toString());
        setSelectedMinCutoff(fixedValue);
      }
    }
    if (moving === 'max') {
      const fixedValue =
        value === maxCutoff ? maxCutoff : parseFloat(value.toFixed(2));
      if (isValid(fixedValue, 'max')) {
        setMaxCutoffText(fixedValue.toString());
        setSelectedMaxCutoff(fixedValue);
      }
    }
  };

  const isValid = (value: number, type: 'min' | 'max') => {
    return (
      !isNaN(value) &&
      value >= minCutoff &&
      value <= maxCutoff &&
      (type === 'min' ? value <= selectedMaxCutoff : value >= selectedMinCutoff)
    );
  };

  const isMinTextValid = isValid(parseFloat(minCutoffText), 'min');
  const isMaxTextValid = isValid(parseFloat(maxCutoffText), 'max');

  const handleSetFromText = (type: 'min' | 'max') => {
    const value =
      type === 'min' ? parseFloat(minCutoffText) : parseFloat(maxCutoffText);
    if (isValid(value, type)) {
      if (type === 'min') {
        setSelectedMinCutoff(value);
      } else {
        setSelectedMaxCutoff(value);
      }
    }
  };

  return (
    <Container
      fluid
      style={{
        padding: '2rem',
      }}
    >
      <Row>
        <Col>
          <strong
            style={{
              marginBottom: 10,
            }}
          >
            Cutoff resolution
          </strong>
        </Col>
      </Row>
      <Row>
        <Col xs={'auto'}>{minCutoff}</Col>
        <Col
          style={{
            maxWidth: 500,
          }}
        >
          <div
            // cursors
            style={{
              position: 'relative',
              width: '100%',
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e9ecef',
              marginTop: 10,
            }}
            onDragOver={(e) => {
              handleMove(e);
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${minCutoffPercent}%`,
                borderRadius: 15,
                height: 15,
                width: 15,
                backgroundColor: '#007bff',
                transform: 'translate(-50%, -50%)',
                cursor: 'grab',
              }}
              draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setDragImage(dragImg, 0, 0);
                setMoving('min');
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${maxCutoffPercent}%`,
                borderRadius: 15,
                height: 15,
                width: 15,
                backgroundColor: '#007bff',
                transform: 'translate(-50%, -50%)',
                cursor: 'grab',
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setDragImage(dragImg, 0, 0);
                setMoving('max');
              }}
            />
          </div>
          <div
            // values
            style={{
              position: 'relative',
              width: '100%',
              height: 35,
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: `${minCutoffPercent}%`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                transform:
                  maxCutoffPercent - minCutoffPercent <= 10
                    ? 'translate(-100%, 0%)'
                    : 'translate(-50%, 0%)',
              }}
            >
              <Form.Control
                size="sm"
                className="text-center"
                style={{
                  width: `${minCutoffText.toString().length + 3}ch`,
                }}
                value={minCutoffText}
                onInput={(e) => {
                  setMinCutoffText(
                    e.currentTarget.value.replaceAll(/[^0-9.-]/g, '')
                  );
                }}
              />
              {minCutoffText !== selectedMinCutoff.toString() && (
                <>
                  {!isMinTextValid ? (
                    <span style={{ color: 'red' }}>Invalid</span>
                  ) : (
                    <Button
                      style={{ padding: 0 }}
                      variant="link"
                      onClick={() => {
                        handleSetFromText('min');
                      }}
                    >
                      Set
                    </Button>
                  )}
                </>
              )}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: `${maxCutoffPercent}%`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                transform:
                  maxCutoffPercent - minCutoffPercent <= 10
                    ? 'translate(0%, 0%)'
                    : 'translate(-50%, 0%)',
              }}
            >
              <Form.Control
                size="sm"
                className="text-center"
                style={{
                  width: `${maxCutoffText.toString().length + 3}ch`,
                }}
                value={maxCutoffText}
                onInput={(e) => {
                  setMaxCutoffText(
                    e.currentTarget.value.replaceAll(/[^0-9.-]/g, '')
                  );
                }}
              />
              {maxCutoffText !== selectedMaxCutoff.toString() && (
                <>
                  {!isMaxTextValid ? (
                    <span style={{ color: 'red' }}>Invalid</span>
                  ) : (
                    <Button
                      style={{ padding: 0 }}
                      variant="link"
                      onClick={() => {
                        handleSetFromText('max');
                      }}
                    >
                      Set
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </Col>
        <Col xs={'auto'}>{maxCutoff}</Col>
      </Row>
    </Container>
  );
}
