import {
  faEdit,
  faFileImport,
  faFilePdf,
  faPlus,
  faPrint,
  faQuestionCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import LoadingPanel from 'legacy/components/loading/loadingpanel';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { openInNewTab } from 'legacy/helpers/opentab';
import { useMXContainers, useShipping } from 'legacy/hooks/ispyb';
import { MXContainer } from 'legacy/pages/mx/container/mxcontainer';
import { Suspense, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container as ContainerB,
  FormCheck,
  Nav,
  OverlayTrigger,
  Popover,
  Row,
  Tab,
} from 'react-bootstrap';
import Select from 'react-select';
import { KeyedMutator } from 'swr';
import { InformationPane } from './informationpane';
import {
  Container,
  Shipment,
  Shipping,
  ShippingContainer,
  ShippingDewar,
} from './model';

import './shipmentview.scss';
import { TransportPane } from './transportpane';

import { containerCapacities } from 'legacy/constants/containers';
import {
  addContainer,
  getDewarLabels,
  getDewarsPdf,
  removeContainer,
  removeDewar,
  saveParcel,
} from 'legacy/api/ispyb';
import axios from 'axios';
import DownloadButton from 'legacy/components/buttons/downloadbutton';
import { EditDewarModal } from './dewarEditModal';

export function ShipmentView({
  proposalName,
  shipment,
  mutateShipments,
}: {
  proposalName: string;
  shipment?: Shipment;
  mutateShipments: KeyedMutator<Container[]>;
}) {
  const { data, isError, mutate } = useShipping({
    proposalName,
    shippingId: shipment?.Shipping_shippingId || 0,
  });

  if (!shipment) {
    return (
      <Row style={{ margin: 10 }}>
        <Alert>
          <FontAwesomeIcon
            style={{ marginRight: 10 }}
            icon={faQuestionCircle}
          ></FontAwesomeIcon>
          Please select shipment on the left
        </Alert>
      </Row>
    );
  }

  if (isError) throw Error(isError);

  if (!data) {
    return (
      <Row style={{ margin: 10 }}>
        <Alert>
          <FontAwesomeIcon
            style={{ marginRight: 10 }}
            icon={faQuestionCircle}
          ></FontAwesomeIcon>
          Could not find selected shipping
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
                      <Nav.Link eventKey="transport">
                        Transport History
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
              </Row>
            </ContainerB>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="information" title="Information">
                <InformationPane
                  proposalName={proposalName}
                  shipping={data}
                  mutateShipping={mutate}
                  mutateShipments={mutateShipments}
                ></InformationPane>
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="transport" title="Transport History">
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                    <TransportPane
                      shipping={data}
                      proposalName={proposalName}
                    ></TransportPane>
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
                    Content ({shipment.parcelCount} parcels -{' '}
                    {shipment.sampleCount} samples)
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
                <ContentPane
                  proposalName={proposalName}
                  shipping={data}
                  mutateShipping={mutate}
                  statisticsMode={false}
                ></ContentPane>
              </Tab.Pane>
            </Tab.Content>
            <Tab.Content>
              <Tab.Pane eventKey="statistics" title="Statistics">
                <ContentPane
                  proposalName={proposalName}
                  shipping={data}
                  mutateShipping={mutate}
                  statisticsMode={true}
                ></ContentPane>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </>
  );
}

export function ContentPane({
  shipping,
  proposalName,
  mutateShipping,
  statisticsMode,
}: {
  shipping: Shipping;
  proposalName: string;
  mutateShipping: KeyedMutator<Shipping>;
  statisticsMode: boolean;
}) {
  const importURL = `/legacy/proposals/${proposalName}/shipping/${shipping.shippingId}/import/csv`;

  const [exporting, setExporting] = useState(false);
  const [creatingNewDewar, setCreatingNewDewar] = useState(false);

  if (exporting) {
    return (
      <ExportPane
        statisticsMode={statisticsMode}
        proposalName={proposalName}
        shipping={shipping}
        onDone={() => setExporting(false)}
      ></ExportPane>
    );
  }

  return (
    <Col style={{ margin: 10 }}>
      <Row>
        <Col md={'auto'}>
          <Button variant="primary" onClick={() => setCreatingNewDewar(true)}>
            <FontAwesomeIcon
              style={{ marginRight: 10 }}
              icon={faPlus}
            ></FontAwesomeIcon>
            Create parcel
          </Button>
          <EditDewarModal
            setShow={setCreatingNewDewar}
            dewar={{ code: '', type: 'Dewar' }}
            show={creatingNewDewar}
            onModifiedDewar={(dewar) => {
              const req = saveParcel({
                proposalName,
                shippingId: String(shipping.shippingId),
                data: dewar,
              });
              axios
                .post(req.url, req.data, { headers: req.headers })
                .then(() => {
                  setCreatingNewDewar(false);
                  mutateShipping();
                });
            }}
          ></EditDewarModal>
        </Col>
        <Col md={'auto'}>
          <Button
            onClick={() => {
              openInNewTab(importURL);
            }}
            variant="primary"
          >
            <FontAwesomeIcon
              style={{ marginRight: 10 }}
              icon={faFileImport}
            ></FontAwesomeIcon>
            Import from CSV
          </Button>
        </Col>
        <Col md={'auto'}>
          <Button variant="primary" onClick={() => setExporting(true)}>
            <FontAwesomeIcon
              style={{ marginRight: 10 }}
              icon={faFilePdf}
            ></FontAwesomeIcon>
            Export to pdf
          </Button>
        </Col>
      </Row>
      {shipping.dewarVOs.length > 0 ? (
        <div
          style={{ height: 2, marginTop: 10, backgroundColor: '#c3c3c3de' }}
        ></div>
      ) : null}
      {shipping.dewarVOs
        .sort(
          (a, b) => (a.dewarId ? a.dewarId : 0) - (b.dewarId ? b.dewarId : 0)
        )
        .map((dewar) => (
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>
            <DewarPane
              statisticsMode={statisticsMode}
              key={dewar.dewarId}
              proposalName={proposalName}
              dewar={dewar}
              shipping={shipping}
              mutateShipping={mutateShipping}
            ></DewarPane>
          </Suspense>
        ))}
    </Col>
  );
}

export function ExportPane({
  shipping,
  proposalName,
  onDone,
  statisticsMode,
}: {
  shipping: Shipping;
  proposalName: string;
  onDone: () => void;
  statisticsMode: boolean;
}) {
  const [selected, setSelected] = useState<(number | undefined)[]>(
    shipping.dewarVOs.map((d) => d.dewarId)
  );

  const toggleSelect = (id: number | undefined) => {
    const newSelect = selected.slice();
    if (newSelect.includes(id)) {
      setSelected(newSelect.filter((a) => a !== id));
    } else {
      newSelect.push(id);
      setSelected(newSelect);
    }
  };

  return (
    <Col style={{ margin: 10 }}>
      <Row>
        <Col md={'auto'}>
          <h5>Select dewars to export</h5>
        </Col>
        <Col md={'auto'}>
          <Button
            variant="primary"
            onClick={() => {
              setSelected(shipping.dewarVOs.map((d) => d.dewarId));
            }}
          >
            Select all
          </Button>
        </Col>
        <Col md={'auto'}>
          <Button
            variant="primary"
            onClick={() => {
              setSelected([]);
            }}
          >
            Unselect all
          </Button>
        </Col>
        <Col md={'auto'}>
          <DownloadButton
            title={'Export - Sort by dewar/container/location'}
            url={
              getDewarsPdf({ proposalName, sort: 1, dewarIds: selected }).url
            }
            fileName={'Sample_list_for_dewars'}
            onClick={onDone}
          ></DownloadButton>
        </Col>
        <Col md={'auto'}>
          <DownloadButton
            title={'Export - Sort by acronym/sample name'}
            url={
              getDewarsPdf({ proposalName, sort: 2, dewarIds: selected }).url
            }
            fileName={'Sample_list_for_dewars'}
            onClick={onDone}
          ></DownloadButton>
        </Col>
        <Col md={'auto'}>
          <Button variant="primary" onClick={onDone}>
            Cancel
          </Button>
        </Col>
      </Row>
      {shipping.dewarVOs.length > 0 ? (
        <div
          style={{ height: 2, marginTop: 10, backgroundColor: '#c3c3c3de' }}
        ></div>
      ) : null}
      {shipping.dewarVOs
        .sort(
          (a, b) => (a.dewarId ? a.dewarId : 0) - (b.dewarId ? b.dewarId : 0)
        )
        .map((dewar) => (
          <div>
            <FormCheck
              style={{
                position: 'relative',
                top: 9,
                left: 2,
                zIndex: 2,
                height: 0,
              }}
              onChange={() => toggleSelect(dewar.dewarId)}
              checked={selected.includes(dewar.dewarId)}
            ></FormCheck>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <DewarPane
                statisticsMode={statisticsMode}
                key={dewar.dewarId}
                proposalName={proposalName}
                dewar={dewar}
                shipping={shipping}
              ></DewarPane>
            </Suspense>
          </div>
        ))}
    </Col>
  );
}

export function DewarPane({
  dewar,
  proposalName,
  shipping,
  mutateShipping,
  editable = true,
  statisticsMode,
}: {
  dewar: ShippingDewar;
  proposalName: string;
  shipping: Shipping;
  mutateShipping?: KeyedMutator<Shipping>;
  editable?: boolean;
  statisticsMode: boolean;
}) {
  const [hide, setHide] = useState(false);
  const [editingDewar, setEditingDewar] = useState(false);

  const { data: samples, isError: isErrorContainer } = useMXContainers({
    proposalName,
    containerIds: dewar.containerVOs.map((c) => String(c.containerId)),
  });
  if (isErrorContainer) throw Error(isErrorContainer);

  if (hide) return null;

  if (samples === undefined) return <></>;

  return (
    <Alert style={{ marginTop: 10 }} variant="light">
      <Row>
        <Col md="auto">
          <SimpleParameterTable
            parameters={
              statisticsMode
                ? [
                    { key: 'Name', value: dewar.code },
                    { key: 'Containers', value: dewar.containerVOs.length },
                    { key: 'Samples', value: samples.length },
                    {
                      key: 'Measured samples',
                      value: samples.filter(
                        (s) =>
                          s.DataCollectionGroup_dataCollectionGroupId !==
                          undefined
                      ).length,
                    },
                  ]
                : [
                    { key: 'Name', value: dewar.code },
                    { key: 'Status', value: dewar.dewarStatus },
                    { key: 'Location', value: dewar.sessionVO?.beamlineName },
                    { key: 'Storage', value: dewar.storageLocation },
                  ]
            }
          ></SimpleParameterTable>
        </Col>
        <Col>
          <Row>
            {dewar.containerVOs
              .sort(
                (a, b) =>
                  (a.containerId ? a.containerId : 0) -
                  (b.containerId ? b.containerId : 0)
              )
              .map((c) => (
                <ContainerView
                  statisticsMode={statisticsMode}
                  key={c.containerId}
                  proposalName={proposalName}
                  container={c}
                  shipping={shipping}
                  dewar={dewar}
                  mutateShipping={mutateShipping}
                ></ContainerView>
              ))}
          </Row>
        </Col>
        {editable && mutateShipping ? (
          <Col
            md="auto"
            style={{
              marginRight: 10,
              paddingLeft: 30,
              borderLeft: '1px solid gray',
            }}
          >
            <Row>
              <Select
                className="containerTypeSelect"
                value={{ label: 'Add container...', value: 0 }}
                options={Object.entries(containerCapacities).map(
                  ([key, value]) => {
                    return { label: key, value: value };
                  }
                )}
                onChange={(v) => {
                  if (v) {
                    const req = addContainer({
                      proposalName,
                      shippingId: String(shipping.shippingId),
                      dewarId: String(dewar.dewarId),
                      containerType: v.label,
                      capacity: v.value,
                    });
                    axios.get(req.url).then(() => mutateShipping());
                  }
                }}
              ></Select>
            </Row>
            <Row>
              <Button
                variant={'primary'}
                style={{ marginTop: 5 }}
                onClick={() => setEditingDewar(true)}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{ marginRight: 5 }}
                ></FontAwesomeIcon>
                Edit
              </Button>
              <EditDewarModal
                setShow={setEditingDewar}
                dewar={dewar}
                show={editingDewar}
                onModifiedDewar={(dewar) => {
                  const req = saveParcel({
                    proposalName,
                    shippingId: String(shipping.shippingId),
                    data: dewar,
                  });
                  axios
                    .post(req.url, req.data, { headers: req.headers })
                    .then(() => {
                      setEditingDewar(false);
                      mutateShipping();
                    });
                }}
              ></EditDewarModal>
            </Row>
            <Row>
              <DownloadButton
                variant={dewar.dewarStatus ? 'secondary' : 'success'}
                style={{ marginTop: 5 }}
                icon={faPrint}
                title="print label"
                fileName={`label_parcel_${dewar.code}_${dewar.dewarId}.pdf`}
                url={
                  getDewarLabels({
                    proposalName,
                    shippingId: String(shipping.shippingId),
                    dewarId: String(dewar.dewarId),
                  }).url
                }
                onClick={() => mutateShipping()}
              ></DownloadButton>
            </Row>
            <Row>
              <Button
                variant={'warning'}
                style={{ marginTop: 5 }}
                onClick={() => {
                  setHide(true);
                  const req = removeDewar({
                    proposalName,
                    shippingId: String(shipping.shippingId),
                    dewarId: String(dewar.dewarId),
                  });
                  axios.get(req.url).then(() => mutateShipping());
                }}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ marginRight: 5 }}
                ></FontAwesomeIcon>
                Remove
              </Button>
            </Row>
          </Col>
        ) : (
          <></>
        )}
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
  editable = true,
  statisticsMode,
}: {
  container: ShippingContainer;
  proposalName: string;
  shipping: Shipping;
  dewar: ShippingDewar;
  mutateShipping?: KeyedMutator<Shipping>;
  editable?: boolean;
  statisticsMode: boolean;
}) {
  const [showPopover, setShowPopover] = useState(false);
  const [show, setShow] = useState(true);

  const { data: samples, isError: isErrorContainer } = useMXContainers({
    proposalName,
    containerIds: [String(container.containerId)],
  });
  if (isErrorContainer) throw Error(isErrorContainer);

  useEffect(() => {
    setShow(true);
  }, [container.containerId]);

  if (samples === undefined) return <></>;

  if (!show) return null;

  const editContainerUrl = `/legacy/proposals/${proposalName}/shipping/${shipping.shippingId}/dewar/${dewar.dewarId}/container/${container.containerId}/edit`;

  const popover = (
    <Popover style={{ width: 240 }}>
      <Popover.Header as="h3">Container</Popover.Header>
      <Popover.Body>
        <Col>
          <Row>
            <SimpleParameterTable
              parameters={
                statisticsMode
                  ? [
                      { key: 'code', value: container.code },
                      { key: 'type', value: container.containerType },
                      { key: 'capacity', value: container.capacity },
                      { key: 'Samples', value: samples.length },
                      {
                        key: 'Measured',
                        value: samples.filter(
                          (s) =>
                            s.DataCollectionGroup_dataCollectionGroupId !==
                            undefined
                        ).length,
                      },
                    ]
                  : [
                      { key: 'code', value: container.code },
                      { key: 'type', value: container.containerType },
                      { key: 'capacity', value: container.capacity },
                    ]
              }
            ></SimpleParameterTable>
          </Row>
          {editable && mutateShipping ? (
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
          ) : (
            <></>
          )}
        </Col>
      </Popover.Body>
    </Popover>
  );

  return (
    <Col style={{ maxWidth: 150 }}>
      <OverlayTrigger
        show={showPopover}
        trigger="focus"
        rootClose
        placement={'top'}
        overlay={popover}
        onToggle={(v) => setShowPopover(v)}
      >
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
          <SimpleParameterTable
            parameters={
              statisticsMode
                ? [
                    { key: 'Samples', value: samples.length },
                    {
                      key: 'Measured',
                      value: samples.filter(
                        (s) =>
                          s.DataCollectionGroup_dataCollectionGroupId !==
                          undefined
                      ).length,
                    },
                  ]
                : [
                    { key: 'code', value: container.code },
                    { key: 'type', value: container.containerType },
                  ]
            }
          ></SimpleParameterTable>
        </Col>
      </OverlayTrigger>
    </Col>
  );
}
