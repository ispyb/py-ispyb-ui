import { useProposal, useShipping, useShippingContainer } from 'hooks/ispyb';
import Page from 'pages/page';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { HotTable, HotColumn } from '@handsontable/react';
import Handsontable from 'handsontable';
import { Shipping, ShippingContainer, ShippingDewar } from '../model';
import { containerToTableData, getCrystalInfo, parseCrystalInfo, parseTableData } from './containertotabledata';
import { registerAllCellTypes } from 'handsontable/cellTypes';
import { Suspense, useEffect, useState } from 'react';
import LoadingPanel from 'components/loading/loadingpanel';
import LazyWrapper from 'components/loading/lazywrapper';
import { spaceGroupShortNames, spaceGroupLongNames } from 'constants/spacegroups';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamationTriangle, faSync } from '@fortawesome/free-solid-svg-icons';
import { Crystal, ProposalDetail } from 'pages/model';
import { registerAllPlugins } from 'handsontable/plugins';
import { saveContainer } from 'api/ispyb';
import axios from 'axios';
import { CrystalEditor } from './crystaleditor';

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

  const { data: shipping, isError: shippingError, mutate: mutateShipping } = useShipping({ proposalName, shippingId: Number(shippingId) }, { autoRefresh: false });

  const { data: container, isError: containerError, mutate: mutateContainer } = useShippingContainer({ proposalName, shippingId, dewarId, containerId }, { autoRefresh: false });

  const { data: proposalArray, isError: proposalError, mutate: mutateProposal } = useProposal({ proposalName }, { autoRefresh: false });

  const [forceRefreshEditor, setForceRefreshEditor] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const errorPage = (msg: unknown) => (
    <Page selected="shipping">
      <Alert variant="danger">
        Opening container editor failed: unable to retrieve information.
        <br />
        {msg}
      </Alert>
    </Page>
  );

  if (!shipping || !container || !proposalArray) {
    return errorPage(!shipping ? 'Shipping does not exist.' : !container ? 'Container does not exist.' : 'Proposal does not exist.');
  }
  if (shippingError || containerError || proposalError) {
    return errorPage(shippingError || containerError || proposalError);
  }

  const proposal = proposalArray[0];

  if (!proposal) {
    return errorPage('Proposal does not exist.');
  }

  const dewar = shipping?.dewarVOs.filter((a) => a.containerVOs.map((c) => c.containerId).includes(Number(containerId)))[0];

  const forceRefresh = () => {
    const whenDone = () => {
      setForceRefreshEditor(forceRefreshEditor + 1);
      setRefreshing(false);
    };
    setRefreshing(true);
    Promise.all([mutateShipping(), mutateContainer(), mutateProposal()]).then(whenDone, whenDone);
  };

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
        {refreshing ? (
          <LoadingPanel></LoadingPanel>
        ) : (
          <LazyWrapper>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <ContainerEditor
                key={forceRefreshEditor}
                proposalName={proposalName}
                proposal={proposal}
                container={container}
                shipping={shipping}
                dewar={dewar}
                forceRefresh={forceRefresh}
              ></ContainerEditor>
            </Suspense>
          </LazyWrapper>
        )}
      </Col>
    </Page>
  );
}

function ContainerEditor({
  container,
  proposalName,
  proposal,
  shipping,
  dewar,
  forceRefresh,
}: {
  shipping: Shipping;
  container: ShippingContainer;
  proposal: ProposalDetail;
  proposalName: string;
  dewar: ShippingDewar;
  forceRefresh: () => void;
}) {
  const upToDateData = containerToTableData(container);

  const [data, setData] = useState(upToDateData);
  const [changed, setChanged] = useState(false);
  const [modifiedCrystals, setModifiedCrystals] = useState<Crystal[]>([]);

  const synchronized = !changed && JSON.stringify(data) == JSON.stringify(upToDateData);

  useEffect(() => {
    const onbeforeunloadFn = (ev: BeforeUnloadEvent) => {
      if (!synchronized) {
        const msg = 'You have some unsaved changes';
        ev.preventDefault();
        (ev || window.event).returnValue = msg;
        return msg;
      }
    };
    window.addEventListener('beforeunload', onbeforeunloadFn);
    return () => {
      window.removeEventListener('beforeunload', onbeforeunloadFn);
    };
  }, [synchronized]);

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

  const addModifiedCrystal = (crystal: Crystal, col: number, row: number) => {
    const n = [crystal, ...modifiedCrystals];
    const filterDouble = _(n)
      .map((crystal) => {
        for (const modifiedCrystal of n) {
          if (
            modifiedCrystal.crystalId == crystal.crystalId ||
            (modifiedCrystal.proteinVO.acronym == crystal.proteinVO.acronym && getCrystalInfo(modifiedCrystal) == getCrystalInfo(crystal))
          ) {
            // only take the first occurrence = latest modification
            return modifiedCrystal;
          }
        }
        return crystal;
      })
      .uniq()
      .value();
    setModifiedCrystals(filterDouble);

    //update modified crystal in data
    const ndata: (string | number | undefined)[][] = JSON.parse(JSON.stringify(data));
    //crystal was modified from this row -> update
    ndata[row][col] = getCrystalInfo(crystal);
    //look if same crystal Id was somewhere else
    for (const r of ndata) {
      const c = parseCrystalInfo(r, crystals, proposal.proteins);
      if (c != undefined && c.crystalId) {
        if (crystal.crystalId == c.crystalId) {
          //if found, update with new crystal info
          console.log('found');
          r[col] = getCrystalInfo(crystal);
        }
      }
    }
    setData(ndata);
  };

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
        if (protein) {
          callback(
            _.uniq([
              'Not set',
              ..._(crystals)
                .filter((c) => c.proteinVO.acronym == protein)
                .map(getCrystalInfo)
                .uniq()
                .sort()
                .value(),
            ])
          );
        } else {
          callback([]);
        }
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

  function handleChanges(changes: Handsontable.CellChange[], source: Handsontable.ChangeSource) {
    const ndata = JSON.parse(JSON.stringify(data));

    const sampleNameIncrement: Record<string, number> = {};

    changes.forEach(([row, prop, oldValue, newValue]) => {
      const newValueString = String(newValue || '');
      const oldValueString = String(oldValue || '');
      if (prop == 1 && oldValueString.trim() != newValueString.trim()) {
        //protein change -> set crystal
        if (newValueString.trim().length) {
          ndata[row][4] = getCrystalInfo(crystals.filter((c) => c.proteinVO.acronym == newValueString)[0]);
        } else {
          ndata[row][4] = undefined;
        }
      }
      if (prop == 2 && source == 'Autofill.fill') {
        //name change from autofill -> increment
        const numbers = newValueString.match(/(\d+)/g);
        let name = newValueString;
        if (numbers) {
          const n = numbers[numbers.length - 1];
          if (newValueString.lastIndexOf(n) == newValueString.length - n.length) {
            name = newValueString.substring(0, newValueString.length - n.length);
            if (!(name in sampleNameIncrement)) {
              sampleNameIncrement[name] = Number(n);
            }
          }
        }
        if (!(name in sampleNameIncrement)) {
          sampleNameIncrement[name] = 0;
        }
        sampleNameIncrement[name] = sampleNameIncrement[name] + 1;
        ndata[row][2] = name + String(sampleNameIncrement[name]);
      }
    });
    setData(ndata);
    setChanged(true);
  }

  function save() {
    const toSave = parseTableData(data, crystals, proposal.proteins, container);
    const request = saveContainer({
      proposalName: proposalName,
      shippingId: String(shipping.shippingId),
      dewarId: String(dewar.dewarId),
      containerId: String(container.containerId),
      data: toSave,
    });
    axios.post(request.url, request.data, { headers: request.headers }).then(
      () => {
        forceRefresh();
      },
      () => {
        forceRefresh();
      }
    );
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
          <Col md={'auto'}>
            <Alert variant="info" style={{ padding: 5 }}>
              <strong>
                <FontAwesomeIcon style={{ marginRight: 5 }} icon={faExclamationTriangle}></FontAwesomeIcon>Sample name field is mandatory and no special characters are allowed
              </strong>
            </Alert>
          </Col>
          <Col md={'auto'}>
            <Alert variant="info" style={{ padding: 5 }}>
              <strong>
                <FontAwesomeIcon style={{ marginRight: 5 }} icon={faExclamationTriangle}></FontAwesomeIcon>Protein + sample name should be unique for the whole proposal
              </strong>
            </Alert>
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
                afterChange: (changes, source) => {
                  if (changes) handleChanges(changes, source);
                },
              }}
            >
              {columns.map((c) => (
                <HotColumn key={c.title} settings={c}>
                  {c.title == 'Crystal Form' ? (
                    <CrystalEditor hot-editor data={data} crystals={crystals} proteins={proposal.proteins} addModifiedCrystal={addModifiedCrystal}></CrystalEditor>
                  ) : undefined}
                </HotColumn>
              ))}
            </HotTable>
          </div>
        </Row>
        <Row>
          <Col md={'auto'}>
            <Alert style={{ marginTop: 5, padding: 5 }} variant={synchronized ? 'success' : 'warning'}>
              <FontAwesomeIcon style={{ marginRight: 5 }} icon={synchronized ? faCheck : faSync}></FontAwesomeIcon>
              <strong>{synchronized ? 'Data is synchronized with server.' : 'Unsaved changes.'}</strong>
            </Alert>
          </Col>
          <Col></Col>
          <Col md={'auto'}>
            <Button style={{ margin: 5 }} disabled={synchronized} onClick={save}>
              Save
            </Button>
            <Button
              style={{ margin: 5 }}
              disabled={synchronized}
              onClick={() => {
                forceRefresh();
              }}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Col>
    </Card>
  );
}
