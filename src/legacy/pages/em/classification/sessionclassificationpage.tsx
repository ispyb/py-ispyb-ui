import { useState } from 'react';
import { useParams } from 'react-router-dom';
import EMPage from 'legacy/pages/em/empage';
import { Card, Accordion, Container, Row, Col, Form } from 'react-bootstrap';
import { useEMClassification } from 'legacy/hooks/ispyb';
import { Classification } from 'legacy/pages/em/model';
import ClassificationPanel from 'legacy/pages/em/classification/classificationpanel';
import Menu from 'legacy/components/menu/menu';

type Param = {
  sessionId?: string;
  proposalName: string;
};

export default function SessionClassificationPage() {
  const { sessionId, proposalName = '' } = useParams<Param>();

  const proposal: string = proposalName ? proposalName : '';
  const { data, isError: sessionError } = useEMClassification({
    sessionId,
    proposalName: proposal,
  });
  if (sessionError) throw Error(sessionError);
  const resolutions = data.map((d: Classification) => d.estimatedResolution);
  const maxCutoff = Math.max(...resolutions);
  const minCutoff = Math.min(...resolutions);

  const [cutoff, setCutoff] = useState<number>(maxCutoff);

  const classificationGroupsId = new Set(
    data.map((d: Classification) => d.particleClassificationGroupId)
  );
  const groups: Classification[][] = [];
  classificationGroupsId.forEach((id) => {
    if (!cutoff) {
      groups.push(
        data.filter(
          (d: Classification) => d.particleClassificationGroupId === id
        )
      );
    } else {
      groups.push(
        data.filter(
          (d: Classification) =>
            d.particleClassificationGroupId === id &&
            d.estimatedResolution <= cutoff
        )
      );
    }
  });

  return (
    <EMPage sessionId={sessionId} proposalName={proposalName}>
      <Menu>
        <div>
          <Form.Label>{`Cutoff resolution ${String.fromCharCode(
            8804
          )} ${cutoff}`}</Form.Label>{' '}
          <Form.Range
            onChange={(e) => setCutoff(e.target.valueAsNumber)}
            step={0.5}
            value={cutoff}
            min={minCutoff}
            max={maxCutoff}
          />
        </div>
      </Menu>
      <Card>
        <div style={{ margin: 10 }}>
          <Accordion>
            {groups.map((group, i) => (
              <Accordion.Item key={i} eventKey={i.toString()}>
                <Accordion.Header>
                  <span>
                    Classification #{i + 1}: {group.length} classes{' '}
                    {group[0]
                      ? `(${group[0].numberOfParticles} particles)`
                      : ''}
                  </span>
                </Accordion.Header>
                <Accordion.Body>
                  <Container fluid>
                    <Row>
                      {group
                        .sort((a: Classification, b: Classification) => {
                          return b.classDistribution - a.classDistribution;
                        })
                        .map((c, i) => (
                          <Col key={i} xs={12} sm={6} lg={4} xl={3} xxl={2}>
                            <ClassificationPanel
                              classification={c}
                              proposalName={proposalName}
                            ></ClassificationPanel>
                          </Col>
                        ))}
                    </Row>
                  </Container>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </Card>
    </EMPage>
  );
}
