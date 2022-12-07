import React, { useState } from 'react';
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

  const [cutoff, setCutoff] = useState<number>(0);

  const proposal: string = proposalName ? proposalName : '';
  const { data, isError: sessionError } = useEMClassification({
    sessionId,
    proposalName: proposal,
  });
  if (sessionError) throw Error(sessionError);

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
            d.estimatedResolution > cutoff
        )
      );
    }
  });

  const resolutions = data.map((d: Classification) => d.estimatedResolution);
  const maxCutoff = Math.max(...resolutions);
  const minCutoff = Math.min(...resolutions);

  return (
    <EMPage sessionId={sessionId} proposalName={proposalName}>
      <Menu>
        <div>
          <Form.Label>{`Cutoff resolution > ${cutoff}`}</Form.Label>
          <Form.Range
            onChange={(e) => setCutoff(e.target.valueAsNumber)}
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
              <Accordion.Item eventKey={i.toString()}>
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
                        .map((c) => (
                          <Col style={{ margin: 2 }}>
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
