import { useProposal, useProposalSamples, useShipping } from 'hooks/ispyb';
import Page from 'pages/page';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import CSVReader from 'react-csv-reader';
import { useState } from 'react';
import { Shipping } from '../model';
import { ProposalDetail, ProposalSample } from 'pages/model';
import Handsontable from 'handsontable';
import HotTable, { HotColumn } from '@handsontable/react';
import _, { min } from 'lodash';
import { EXPERIMENT_TYPES } from 'constants/experiments';
import { spaceGroupLongNames, spaceGroupShortNames } from 'constants/spacegroups';
import './importshipping.scss';
import { validateShipping } from 'helpers/mx/shipping/shippingcsv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faFileImport, faSave } from '@fortawesome/free-solid-svg-icons';
import { CellMeta } from 'handsontable/settings';
import { CommentObject } from 'handsontable/plugins/comments';

type Param = {
  proposalName: string;
  shippingId: string;
};

export function ImportShippingFromCSV() {
  const { proposalName = '', shippingId = '' } = useParams<Param>();

  const { data: shipping, isError: shippingError, mutate: mutateShipping } = useShipping({ proposalName, shippingId: Number(shippingId) });
  const { data: proposalArray, isError: proposalError, mutate: mutateProposal } = useProposal({ proposalName });
  const { data: proposalSamples, isError: proposalSampleError, mutate: mutateProposalSamples } = useProposalSamples({ proposalName });

  const errorPage = (msg: unknown) => (
    <Page selected="shipping">
      <Alert variant="danger">
        Opening CSV import failed: unable to retrieve information.
        <br />
        {msg}
      </Alert>
    </Page>
  );

  if (!shipping || !proposalArray) {
    return errorPage(!shipping ? 'Shipping does not exist.' : 'Proposal does not exist.');
  }
  if (shippingError || proposalError || proposalSampleError) {
    return errorPage(shippingError || proposalError || proposalSampleError);
  }
  const proposal = proposalArray[0];

  if (!proposal || proposalSamples == undefined) {
    return errorPage('Proposal does not exist.');
  }

  return (
    <Page selected="shipping">
      <Col>
        <Alert variant="primary">
          <h5>
            Importing to shipment:<br></br>
            <strong>
              {proposalName} - {shipping.shippingName}
            </strong>
          </h5>
        </Alert>
        <Row>
          <CSVShippingImporter proposal={proposal} shipping={shipping} proposalSamples={proposalSamples}></CSVShippingImporter>
        </Row>
      </Col>
    </Page>
  );
}

export function CSVShippingImporter({ shipping, proposal, proposalSamples }: { shipping: Shipping; proposal: ProposalDetail; proposalSamples: ProposalSample[] }) {
  const [data, setData] = useState<(string | number | undefined)[][] | undefined>(undefined);
  const papaparseOptions = {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
    comments: '#',
  };
  const onCSVLoaded = (newData: (string | number | undefined)[][]) => {
    setData(newData);
  };
  return (
    <Col>
      <Row>
        <CSVReader
          cssInputClass="form-control form-control-sm"
          label={'Choose import source file'}
          cssLabelClass="form-label"
          parserOptions={papaparseOptions}
          onFileLoaded={onCSVLoaded}
        />
      </Row>
      <Row>
        <small>
          Do you need help? Click{' '}
          <a target="_blank" href="https://github.com/ispyb/EXI/wiki/Fill-shipment-from-CSV">
            here
          </a>
          . Examples can be found here:{' '}
          <a target="_blank" href="https://raw.githubusercontent.com/ispyb/EXI/master/csv/example3.csv">
            example.csv
          </a>
        </small>
      </Row>
      <Row>
        {[
          'Parcel Name should be unique for this shipment',
          'Container name should be unique for this shipment',
          'Protein + sample name should be unique for the whole proposal',
          'Sample name field is mandatory and no special characters are allowed',
          'Only Unipuck container type at MAX IV',
        ].map((m) => (
          <Col key={m} md={'auto'}>
            <Alert style={{ marginTop: 5, padding: 5 }} variant="info">
              <FontAwesomeIcon style={{ marginRight: 5 }} icon={faExclamationTriangle}></FontAwesomeIcon>
              <small>{m} </small>
            </Alert>
          </Col>
        ))}
      </Row>
      <div style={{ height: 2, marginTop: 10, marginBottom: 20, backgroundColor: '#c3c3c3de' }}></div>
      {data ? (
        <CSVShippingImporterTable onDataChange={setData} proposal={proposal} shipping={shipping} proposalSamples={proposalSamples} data={data}></CSVShippingImporterTable>
      ) : (
        <></>
      )}
    </Col>
  );
}

const lastColor: { [column: number]: number } = {};
const maxColor = 8;
const valueColors: { [key: string]: number } = {};

const getNextColorForColumn = (column: number) => {
  let next = 1;
  if (column in lastColor) {
    const last = lastColor[column];
    if (last < maxColor) {
      next = last + 1;
    }
  }
  lastColor[column] = next;
  return next;
};

const getClassForValue = (column: number, value: string | number | undefined) => {
  if (value == undefined || String(value).trim().length == 0) {
    return '';
  }
  const key = `column=${column}+value=${value}`;
  if (key in valueColors) {
    return `color${valueColors[key]}`;
  } else {
    const newValueColor = getNextColorForColumn(column);
    valueColors[key] = newValueColor;
    return `color${newValueColor}`;
  }
};

export function CSVShippingImporterTable({
  shipping,
  proposal,
  proposalSamples,
  data,
  onDataChange,
}: {
  shipping: Shipping;
  proposal: ProposalDetail;
  proposalSamples: ProposalSample[];
  data: (string | number | undefined)[][];
  // eslint-disable-next-line no-unused-vars
  onDataChange: (data: (string | number | undefined)[][]) => void;
}) {
  const errors = validateShipping(data, shipping, proposalSamples);
  const getErrorsForCell = (row: number, col: number) => {
    const res = errors.filter((e) => e.row == row && e.col == col);
    return res;
  };
  const generateCellProperties = (row: number, col: number): CellMeta => {
    const colorClass = getClassForValue(col, data[row][col]);
    const errors = getErrorsForCell(row, col);
    const classNames = [...(colorClass ? [colorClass] : []), ...(errors.length ? ['error'] : [])];
    const comment: CommentObject | undefined = errors.length ? { value: errors.map((e) => '- ' + e.message).join('\n'), readOnly: true } : undefined;
    return { className: classNames, comment };
  };

  const columns: Handsontable.ColumnSettings[] = [
    {
      title: 'Parcel<br />Name',
    },
    {
      title: 'Container<br />Name',
    },
    { title: 'Container<br />Type' },
    { title: 'Container<br />Position' },
    {
      title: 'Protein<br />Acronym',
    },
    { title: 'Sample<br />Acronym' },
    { title: 'Pin<br />Barcode' },
    {
      title: 'Spacegroup',
      source: ['', ..._(spaceGroupShortNames).concat(spaceGroupLongNames).uniq().value()],
      type: 'autocomplete',
      filter: true,
      strict: true,
      allowInvalid: false,
    },
    { title: 'A' },
    { title: 'B' },
    { title: 'C' },
    { title: 'Alpha' },
    { title: 'Beta' },
    { title: 'Gamma' },
    { title: 'Experiment<br />Type', type: 'autocomplete', filter: true, strict: true, allowInvalid: false, source: EXPERIMENT_TYPES },
    { title: 'Aimed<br />Resolution' },
    { title: 'Required<br />Resolution' },
    { title: 'Beam<br />Diameter' },
    { title: 'Number of<br />positions' },
    { title: 'Aimed<br />multiplicity' },
    { title: 'Aimed<br />completeness' },
    {
      title: 'Forced<br />Spacegroup',
      source: ['', ..._(spaceGroupShortNames).concat(spaceGroupLongNames).uniq().value()],
      type: 'autocomplete',
      filter: true,
      strict: true,
      allowInvalid: false,
    },
    { title: 'Radiation<br />sensitivity' },
    { title: 'Smiles' },
    { title: 'Total<br />rot. angle' },
    { title: 'Min<br />osc. angle' },
    { title: 'Observed<br />resolution' },
    { title: 'Comments' },
  ];

  function handleChanges(changes: Handsontable.CellChange[], source: Handsontable.ChangeSource) {
    const ndata = JSON.parse(JSON.stringify(data));
    changes.forEach(([row, prop, oldValue, newValue]) => {
      ndata[row][prop] = newValue;
    });
    onDataChange(ndata);
  }

  return (
    <Row>
      <Col>
        <Row>
          <h5>Please check content before importing.</h5>
        </Row>
        <Row>
          <small>Fields with same value have same color.</small>
        </Row>
        <Row>
          <div id="hot-app">
            <HotTable
              rowHeights={25}
              height={min([25 * data.length + 55, 500])}
              colHeaders={true}
              comments={true}
              settings={{
                data: data,
                licenseKey: 'non-commercial-and-evaluation',
                stretchH: 'all',
                fixedColumnsStart: 6,
                autoColumnSize: {
                  syncLimit: 100,
                },
                cells(row, col) {
                  return generateCellProperties(row, col);
                },
                beforeChange: (changes, source) => {
                  console.log([changes, source]);
                  if (changes) handleChanges(changes, source);
                },
              }}
            >
              {columns.map((c) => (
                <HotColumn key={c.title} settings={c}></HotColumn>
              ))}
            </HotTable>
          </div>
        </Row>
        {errors.length > 0 ? (
          <Row style={{ maxHeight: 65, overflowY: 'scroll', backgroundColor: 'rgb(195 195 195 / 22%)', borderBottom: '2px solid #c3c3c3de', marginRight: 0, marginLeft: 0 }}>
            {_(errors)
              .map((e) => e.message)
              .uniq()
              .map((e) => (
                <Col key={e} md={'auto'}>
                  <Alert style={{ marginTop: 5, padding: 5 }} variant={'danger'}>
                    <FontAwesomeIcon style={{ marginRight: 5 }} icon={faExclamationTriangle}></FontAwesomeIcon>
                    <strong>{e}</strong>
                  </Alert>
                </Col>
              ))
              .value()}
          </Row>
        ) : null}
        <Row style={{ marginTop: 10 }}>
          <Col></Col>
          <Col md={'auto'}>
            <Button disabled={errors.length > 0}>
              <FontAwesomeIcon style={{ marginRight: 10 }} icon={faSave}></FontAwesomeIcon>
              {errors.length > 0 ? 'Fix errors to finalize import' : 'Finalize import'}
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
