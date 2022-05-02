import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { useShipping } from 'hooks/ispyb';
import { MXContainer } from 'pages/mx/container/mxcontainer';
import { Alert, Card, Col, Container as ContainerB, Nav, Row, Tab } from 'react-bootstrap';
import { KeyedMutator } from 'swr';
import { InformationPane } from './informationpane';
import { Container, Shipment, Shipping, ShippingDewar } from './model';

import './shipmentview.scss';
import { TransportPane } from './transportpane';

export function ShipmentView({ proposalName, shipment, mutateShipments }: { proposalName: string; shipment?: Shipment; mutateShipments: KeyedMutator<Container[]> }) {
  if (!shipment) {
    return (
      <Row style={{ margin: 10 }}>
        <Alert>
          <FontAwesomeIcon style={{ marginRight: 10 }} icon={faQuestionCircle}></FontAwesomeIcon>Please select shipment on the left
        </Alert>
      </Row>
    );
  }

  const { data, isError, mutate } = useShipping({ proposalName, shippingId: shipment.Shipping_shippingId });

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
            <ContainerB fluid>
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
            </ContainerB>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="information" title="Information">
                <InformationPane proposalName={proposalName} shipping={data} mutateShipping={mutate} mutateShipments={mutateShipments}></InformationPane>
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="transport" title="Transport History">
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <TransportPane shipping={data} proposalName={proposalName}></TransportPane>
                </LazyWrapper>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
      <Tab.Container defaultActiveKey="content">
        <Card className="card-shipment">
          <Card.Header>
            <ContainerB fluid>
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
            </ContainerB>
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
