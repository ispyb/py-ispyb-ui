import { useProposal, useShipping, useShippingContainer } from 'hooks/ispyb';
import Page from 'pages/page';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { HotTable, HotColumn } from '@handsontable/react';
import Handsontable from 'handsontable';
import { Shipping, ShippingContainer } from '../model';
import { containerToTableData, getCrystalInfo } from './containertotabledata';
import { registerAllCellTypes } from 'handsontable/cellTypes';
import { Suspense, useState } from 'react';
import LoadingPanel from 'components/loading/loadingpanel';
import LazyWrapper from 'components/loading/lazywrapper';
import { spaceGroupShortNames, spaceGroupLongNames } from 'constants/spacegroups';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSync } from '@fortawesome/free-solid-svg-icons';
import { Crystal } from 'pages/model';
import { registerAllPlugins } from 'handsontable/plugins';

type Param = {
  proposalName: string;
  shippingId: string;
  dewarId: string;
  containerId: string;
};

registerAllCellTypes();
registerAllPlugins();

export default function ContainerEditPage() {
  const { proposalName = '', shippingId = '', dewarId = '', containerId = '' } = useParams<Param>();

  const { data: shipping, isError: shippingError } = useShipping({ proposalName, shippingId: Number(shippingId) });

  const { data: container, isError: containerError } = useShippingContainer({ proposalName, shippingId, dewarId, containerId });

  if (!shipping || !container || shippingError || containerError) {
    return <></>;
  }

  const dewar = shipping?.dewarVOs.filter((a) => a.containerVOs.map((c) => c.containerId).includes(Number(containerId)))[0];

  return (
    <Page selected="shipping">
      <Col>
        <Alert variant="primary">
          <h5>
            Editing container from:<br></br>
            <strong>
              {shipping.shippingName} ({dewar.code})
            </strong>
          </h5>
        </Alert>
        <LazyWrapper>
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>
            <ContainerEditor proposalName={proposalName} container={container} shipping={shipping}></ContainerEditor>
          </Suspense>
        </LazyWrapper>
      </Col>
    </Page>
  );
}

function ContainerEditor({ container, proposalName }: { shipping: Shipping; container: ShippingContainer; proposalName: string }) {
  const { data: proposalArray, isError: proposalError } = useProposal({ proposalName });
  const upToDateData = containerToTableData(container);

  const [data, setData] = useState(upToDateData);
  const [changed, setChanged] = useState(false);
  const [modifiedCrystals, setModifiedCrystals] = useState<Crystal[]>([]);

  if (!proposalArray || proposalError) {
    return <></>;
  }
  const proposal = proposalArray[0];

  if (!proposal) {
    return <></>;
  }

  const synchronized = !changed && JSON.stringify(data) == JSON.stringify(upToDateData);

  const crystals = _([
    ...modifiedCrystals,
    ...proposal.crystals.map((crystal) => {
      for (const modifiedCrystal of modifiedCrystals) {
        if (
          modifiedCrystal.crystalId == crystal.crystalId ||
          (modifiedCrystal.proteinVO.acronym == crystal.proteinVO.acronym && getCrystalInfo(modifiedCrystal) == getCrystalInfo(crystal))
        ) {
          //if crystal is the same as one of the modified ones, replace by modified version
          return modifiedCrystal;
        }
      }
      return crystal;
    }),
  ])
    .uniq()
    .value();

  const columns: Handsontable.ColumnSettings[] = [
    { title: '#', width: 30, readOnly: true },
    {
      title: 'Protein <br />Acronym',
      type: 'autocomplete',
      source: _(proposal.proteins)
        .map((p) => p.acronym)
        .uniq()
        .value(),
      strict: true,
      allowInvalid: false,
      filter: true,
    },
    { title: 'Sample<br /> Name' },
    { title: 'Pin <br />BarCode' },
    {
      title: 'Crystal Form',
      source(query, callback) {
        const protein = data[this.row][1];
        callback([
          protein ? 'NEW' : '',
          ..._(crystals)
            .filter((c) => c.proteinVO.acronym == protein)
            .map(getCrystalInfo)
            .uniq()
            .sort()
            .value(),
        ]);
      },
      type: 'autocomplete',
      strict: true,
      allowInvalid: false,
      filter: false,
    },
    {
      title: 'Exp.<br /> Type',
      type: 'autocomplete',
      filter: true,
      strict: true,
      allowInvalid: false,
      source: ['', 'Default', 'MXPressE', 'MXPressF', 'MXPressO', 'MXPressI', 'MXPressE_SAD', 'MXScore', 'MXPressM', 'MXPressP', 'MXPressP_SAD'],
    },
    { title: 'Aimed<br /> resolution' },
    { title: 'Required<br /> resolution' },
    { title: 'Beam <br />Diameter' },
    { title: 'Number of<br /> positions' },
    { title: 'Aimed<br /> multiplicity' },
    { title: 'Aimed<br /> Completeness' },
    {
      title: 'Forced <br /> Space G.',
      source: ['', ..._(spaceGroupShortNames).concat(spaceGroupLongNames).uniq().value()],
      type: 'autocomplete',
      filter: true,
      strict: true,
      allowInvalid: false,
    },
    { title: 'Radiation<br /> Sensitivity' },
    { title: 'Smiles' },
    { title: 'Tot Rot. <br />Angle' },
    { title: 'Min Osc.<br />Angle' },
    { title: 'Observed <br />resolution' },
    { title: 'Comments' },
    {
      title: 'Ligands',
      type: 'autocomplete',
      source: [
        '',
        ..._(proposal.ligands)
          .map((l) => l.groupName)
          .uniq()
          .value(),
      ],
      filter: true,
      strict: true,
      allowInvalid: false,
    },
  ];

  function handleChange(row: number, prop: string | number, oldValue: string | number | undefined, newValue: string | number | undefined) {
    setChanged(true);
    if (prop == 1) {
      //protein change
      const ndata = JSON.parse(JSON.stringify(data));
      ndata[row][4] = getCrystalInfo(proposal.crystals.filter((c) => c.proteinVO.acronym == newValue)[0]);
      setData(ndata);
    }
  }

  return (
    <Card style={{ padding: 20 }}>
      <Col>
        <Row>
          <Col>
            <h5>Name: {container.code}</h5>
          </Col>
          <Col>
            <h5>Type: {container.containerType}</h5>
          </Col>
          <Col>
            <h5>Beamline : {container.beamlineLocation}</h5>
          </Col>
          <Col>
            <h5>#Sample Changer: {container.sampleChangerLocation}</h5>
          </Col>
          <Col>
            <h5>Status: {container.containerStatus}</h5>
          </Col>
        </Row>
        <Row>
          <div id="hot-app">
            <HotTable
              rowHeights={25}
              height={25 * data.length + 55}
              colHeaders={true}
              settings={{
                data: data,
                licenseKey: 'non-commercial-and-evaluation',
                stretchH: 'all',
                fixedColumnsStart: 1,
                autoColumnSize: {
                  syncLimit: 100,
                },
                afterChange: (changes) => {
                  if (changes)
                    changes.forEach(([row, prop, oldValue, newValue]) => {
                      handleChange(row, prop, oldValue, newValue);
                    });
                },
              }}
            >
              {columns.map((c) => (
                <HotColumn key={c.title} settings={c}></HotColumn>
              ))}
            </HotTable>
          </div>
        </Row>
        <Row>
          <Col>
            {!synchronized ? (
              <Alert style={{ margin: 5 }} variant="warning">
                <FontAwesomeIcon style={{ marginRight: 5 }} icon={faSync}></FontAwesomeIcon>
                <strong>Changes not saved to server</strong>
              </Alert>
            ) : (
              <Alert style={{ margin: 5 }} variant="info">
                <FontAwesomeIcon style={{ marginRight: 5 }} icon={faCheck}></FontAwesomeIcon>
                <strong>Data is synchronized to server</strong>
              </Alert>
            )}
          </Col>
          <Col md={'auto'}>
            <Button style={{ margin: 5 }} disabled={synchronized}>
              Save
            </Button>
            <Button
              style={{ margin: 5 }}
              disabled={synchronized}
              onClick={() => {
                setData(upToDateData);
                setChanged(false);
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Col>
    </Card>
  );
}
