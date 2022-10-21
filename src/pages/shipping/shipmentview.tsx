import { faEdit, faFileImport, faQuestionCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { openInNewTab } from 'helpers/opentab';
import { useShipping } from 'hooks/ispyb';
import { MXContainer } from 'pages/mx/container/mxcontainer';
import { Suspense, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container as ContainerB, Nav, OverlayTrigger, Popover, Row, Tab } from 'react-bootstrap';
import Select from 'react-select';
import { KeyedMutator } from 'swr';
import { InformationPane } from './informationpane';
import { Container, Shipment, Shipping, ShippingContainer, ShippingDewar } from './model';

import './shipmentview.scss';
import { TransportPane } from './transportpane';

import { containerCapacities } from 'constants/containers';
import { addContainer, removeContainer } from 'api/ispyb';
import axios from 'axios';

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
                  <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                    <TransportPane shipping={data} proposalName={proposalName}></TransportPane>
                  </Suspense>
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
                <ContentPane proposalName={proposalName} shipping={data} mutateShipping={mutate}></ContentPane>
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

export function ContentPane({ shipping, proposalName, mutateShipping }: { shipping: Shipping; proposalName: string; mutateShipping: KeyedMutator<Shipping> }) {
  const importURL = `/${proposalName}/shipping/${shipping.shippingId}/import/csv`;

  return (
    <Col style={{ margin: 10 }}>
      <Row>
        <Col>
          <Button
            onClick={() => {
              openInNewTab(importURL);
            }}
            variant="primary"
          >
            <FontAwesomeIcon style={{ marginRight: 10 }} icon={faFileImport}></FontAwesomeIcon>
            Import from CSV
          </Button>
        </Col>
      </Row>
      {shipping.dewarVOs.length > 0 ? <div style={{ height: 2, marginTop: 10, backgroundColor: '#c3c3c3de' }}></div> : null}
      {shipping.dewarVOs
        .sort((a, b) => (a.dewarId ? a.dewarId : 0) - (b.dewarId ? b.dewarId : 0))
        .map((dewar) => (
          <DewarPane key={dewar.dewarId} proposalName={proposalName} dewar={dewar} shipping={shipping} mutateShipping={mutateShipping}></DewarPane>
        ))}
    </Col>
  );
}

export function DewarPane({
  dewar,
  proposalName,
  shipping,
  mutateShipping,
}: {
  dewar: ShippingDewar;
  proposalName: string;
  shipping: Shipping;
  mutateShipping: KeyedMutator<Shipping>;
}) {
  return (
    <Alert style={{ marginTop: 10 }} variant="light">
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
              .sort((a, b) => (a.containerId ? a.containerId : 0) - (b.containerId ? b.containerId : 0))
              .map((c) => (
                <ContainerView key={c.containerId} proposalName={proposalName} container={c} shipping={shipping} dewar={dewar} mutateShipping={mutateShipping}></ContainerView>
              ))}
          </Row>
        </Col>
        <Col md="auto">
          <Select
            className="containerTypeSelect"
            value={{ label: 'Add container...', value: 0 }}
            options={Object.entries(containerCapacities).map(([key, value]) => {
              return { label: key, value: value };
            })}
            onChange={(v) => {
              if (v) {
                const req = addContainer({ proposalName, shippingId: String(shipping.shippingId), dewarId: String(dewar.dewarId), containerType: v.label, capacity: v.value });
                axios.get(req.url).then(() => mutateShipping());
              }
            }}
          ></Select>
        </Col>
      </Row>
    </Alert>
  );
}

export function ContainerView({
  container,
  proposalName,
  shipping,
  dewar,
  mutateShipping,
}: {
  container: ShippingContainer;
  proposalName: string;
  shipping: Shipping;
  dewar: ShippingDewar;
  mutateShipping: KeyedMutator<Shipping>;
}) {
  const [showPopover, setShowPopover] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
  }, [container.containerId]);

  if (!show) return null;

  const editContainerUrl = `/${proposalName}/shipping/${shipping.shippingId}/dewar/${dewar.dewarId}/container/${container.containerId}/edit`;

  const popover = (
    <Popover style={{ width: 240 }}>
      <Popover.Header as="h3">Container</Popover.Header>
      <Popover.Body>
        <Col>
          <Row>
            <SimpleParameterTable
              parameters={[
                { key: 'code', value: container.code },
                { key: 'type', value: container.containerType },
                { key: 'capacity', value: container.capacity },
              ]}
            ></SimpleParameterTable>
          </Row>
          <Row>
            <Col md={'auto'} style={{ paddingRight: 0 }}>
              <Button onClick={() => openInNewTab(editContainerUrl)}>
                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> Edit
              </Button>
            </Col>
            <Col md={'auto'}>
              <Button
                variant="warning"
                onClick={() => {
                  setShow(false);
                  const req = removeContainer({
                    proposalName,
                    shippingId: String(shipping.shippingId),
                    dewarId: String(dewar.dewarId),
                    containerId: String(container.containerId),
                  });
                  axios.get(req.url).then(() => mutateShipping());
                }}
              >
                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon> Remove
              </Button>
            </Col>
          </Row>
        </Col>
      </Popover.Body>
    </Popover>
  );

  return (
    <Col style={{ maxWidth: 150 }}>
      <OverlayTrigger show={showPopover} trigger="focus" rootClose placement={'top'} overlay={popover} onToggle={(v) => setShowPopover(v)}>
        <Col>
          <Row>
            <MXContainer
              proposalName={proposalName}
              containerId={String(container.containerId)}
              containerType={container.containerType}
              showInfo={false}
              onContainerClick={() => setShowPopover(true)}
            ></MXContainer>
          </Row>
          <Row>
            <Col></Col>
            <Col md={'auto'}>
              <strong>{container.code}</strong>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col md={'auto'}>
              <small>{container.containerType}</small>
            </Col>
            <Col></Col>
          </Row>
        </Col>
      </OverlayTrigger>
    </Col>
  );
}
