import { useMxWorkflow } from 'hooks/ispyb';
import useQueryParams from 'hooks/usequeyparams';
import _ from 'lodash';
import Page from 'pages/page';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import WorkflowContent from './workflowcontent';
import WorkflowThumbnail from './workflowthumbnail';

type Param = {
  sessionId: string;
  proposalName: string;
  workflowId: string;
  stepsIds: string;
};

export default function MXWorkflowPage() {
  const { proposalName = '', stepsIds = '' } = useParams<Param>();
  const { select } = useQueryParams();

  const ids = stepsIds.split(',');

  const steps = _(ids)
    .map((stepId) => {
      return {
        stepId,
        data: useMxWorkflow({ proposalName, stepId }),
      };
    })
    .map((res) => {
      if (res.data.data) {
        return {
          stepId: res.stepId,
          thumbnail: <WorkflowThumbnail proposalName={proposalName} stepId={res.stepId} step={res.data.data}></WorkflowThumbnail>,
          content: <WorkflowContent step={res.data.data}></WorkflowContent>,
        };
      }
    })
    .value();

  return (
    <Page selected="MXworkflows">
      <Tab.Container defaultActiveKey={select}>
        <Row style={{ padding: 5, borderBottom: '1px solid gray' }}>
          <Nav variant="pills">
            {steps.map((elem) => {
              return (
                <Col style={{ height: '100%', maxWidth: 300 }}>
                  <Nav.Item style={{ height: '100%' }}>
                    <Nav.Link style={{ height: '100%' }} eventKey={elem?.stepId}>
                      {elem?.thumbnail}
                    </Nav.Link>
                  </Nav.Item>
                </Col>
              );
            })}
          </Nav>
        </Row>
        <Row>
          <Tab.Content>
            {steps.map((elem) => {
              return <Tab.Pane eventKey={elem?.stepId}>{elem?.content}</Tab.Pane>;
            })}
            <Tab.Pane eventKey="first"></Tab.Pane>
            <Tab.Pane eventKey="second"></Tab.Pane>
          </Tab.Content>
        </Row>
      </Tab.Container>
    </Page>
  );
}
