import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { formatDateTo } from 'helpers/dateparser';
import { useShipping } from 'hooks/ispyb';
import { MXContainer } from 'pages/mx/container/mxcontainer';
import { Alert, Card, Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import { Shipment, Shipping, ShippingDewar } from './model';

import './shipmentview.scss';

export function ShipmentView({ proposalName, shipment }: { proposalName: string; shipment?: Shipment }) {
  if (!shipment) {
    return (
      <Row style={{ margin: 10 }}>
        <Alert>
          <FontAwesomeIcon style={{ marginRight: 10 }} icon={faQuestionCircle}></FontAwesomeIcon>Please select shipment on the left
        </Alert>
      </Row>
    );
  }

  const { data, isError } = useShipping({ proposalName, shippingId: shipment.Shipping_shippingId });

  if (isError) throw Error(isError);

  if (!data) {
    return (
      <Row style={{ margin: 10 }}>
        <Alert>
          <FontAwesomeIcon style={{ marginRight: 10 }} icon={faQuestionCircle}></FontAwesomeIcon>Could not find selected shipping
        </Alert>
      </Row>
    );
  }
  return (
    <>
      <Tab.Container defaultActiveKey="information">
        <Card className="card-shipment">
          <Card.Header>
            <Container fluid>
              <Row>
                <Col md="auto">
                  <h5>{data.shippingName}</h5>
                </Col>
                <Col></Col>
                <Col md="auto">
                  <Nav className="tabs-card-shipment" variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="information">Information</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="transport">Transport History</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="information" title="Information">
                <InformationPane shipping={data}></InformationPane>
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="transport" title="Transport History"></Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
      <Tab.Container defaultActiveKey="content">
        <Card className="card-shipment">
          <Card.Header>
            <Container fluid>
              <Row>
                <Col md="auto">
                  <h5>
                    Content ({shipment.parcelCount} parcels - {shipment.sampleCount} samples)
                  </h5>
                </Col>
                <Col></Col>
                <Col md="auto">
                  <Nav className="tabs-card-shipment" variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="content">Content</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="statistics">Statistics</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="content" title="Content">
                <ContentPane proposalName={proposalName} shipping={data}></ContentPane>
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="statistics" title="Statistics"></Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </>
  );
}

export function InformationPane({ shipping }: { shipping: Shipping }) {
  return (
    <Row>
      <Col md={'auto'}>
        <SimpleParameterTable
          parameters={[
            { key: 'Beamline', value: shipping.sessions.length ? shipping.sessions[0].beamlineName : '' },
            { key: 'Sender address', value: shipping.sendingLabContactVO.cardName },
            { key: 'Return address', value: shipping.returnLabContactVO.cardName },
          ]}
        ></SimpleParameterTable>
      </Col>
      <Col md={'auto'}>
        <SimpleParameterTable
          parameters={[
            { key: 'Date', value: formatDateTo(shipping.timeStamp, 'dd/MM/yyy') },
            { key: 'Status', value: shipping.shippingStatus },
          ]}
        ></SimpleParameterTable>
      </Col>
    </Row>
  );
}

export function ContentPane({ shipping, proposalName }: { shipping: Shipping; proposalName: string }) {
  return (
    <>
      {shipping.dewarVOs.map((dewar) => (
        <DewarPane proposalName={proposalName} dewar={dewar}></DewarPane>
      ))}
    </>
  );
}

export function DewarPane({ dewar, proposalName }: { dewar: ShippingDewar; proposalName: string }) {
  return (
    <Alert style={{ margin: 10 }} variant="light">
      <Row>
        <Col md="auto">
          <SimpleParameterTable
            parameters={[
              { key: 'Name', value: dewar.code },
              { key: 'Status', value: dewar.dewarStatus },
              { key: 'Location', value: dewar.sessionVO?.beamlineName },
              { key: 'Storage', value: dewar.storageLocation },
            ]}
          ></SimpleParameterTable>
        </Col>
        <Col>
          <Row>
            {dewar.containerVOs
              .sort((a, b) => b.containerId - a.containerId)
              .map((c) => (
                <Col style={{ maxWidth: 150 }}>
                  <MXContainer proposalName={proposalName} containerId={String(c.containerId)}></MXContainer>
                </Col>
              ))}
          </Row>
        </Col>
      </Row>
    </Alert>
  );
}
