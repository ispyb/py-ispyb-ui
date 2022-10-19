import { useProposal, useProposalSamples, useShipping } from 'hooks/ispyb';
import Page from 'pages/page';
import { Alert, Col, Row } from 'react-bootstrap';
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
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { of } from 'rxjs';
import { CellMeta } from 'handsontable/settings';
import { CommentObject } from 'handsontable/plugins/comments';

type Param = {
  proposalName: string;
  shippingId: string;
};

export function ImportShippingFromCSV() {
  const { proposalName = '', shippingId = '' } = useParams<Param>();

  const { data: shipping, isError: shippingError, mutate: mutateShipping } = useShipping({ proposalName, shippingId: Number(shippingId) }, { autoRefresh: false });
  const { data: proposalArray, isError: proposalError, mutate: mutateProposal } = useProposal({ proposalName }, { autoRefresh: false });
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
      <CSVReader parserOptions={papaparseOptions} onFileLoaded={onCSVLoaded} />
      {data ? <CSVShippingImporterTable proposal={proposal} shipping={shipping} proposalSamples={proposalSamples} data={data}></CSVShippingImporterTable> : <></>}
    </Col>
  );
}

const lastColor: { [column: string]: number } = {};
const maxColor = 10;
const valueColors: { [value: string]: number } = {};

const getNextColorForColumn = (column: string) => {
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

const getClassForValue = (column: string, value: string) => {
  if (value in valueColors) {
    return `color${valueColors[value]}`;
  } else {
    const newValueColor = getNextColorForColumn(column);
    valueColors[value] = newValueColor;
    return `color${newValueColor}`;
  }
};

export function CSVShippingImporterTable({
  shipping,
  proposal,
  proposalSamples,
  data,
}: {
  shipping: Shipping;
  proposal: ProposalDetail;
  proposalSamples: ProposalSample[];
  data: (string | number | undefined)[][];
}) {
  const errors = validateShipping(data, proposalSamples);
  const getErrorForCell = (row: number, col: number) => {
    for (const error of errors) {
      if (error.row == row && error.col == col) {
        return error;
      }
    }
    return undefined;
  };
  const generateCellProperties = (row: number, col: number, columnNameForColor: string | undefined = undefined): CellMeta => {
    const colorClass = columnNameForColor != undefined ? getClassForValue(columnNameForColor, String(data[row][col])) : undefined;
    const error = getErrorForCell(row, col);
    const classNames = [...(colorClass ? [colorClass] : []), ...(error ? ['error'] : [])];
    const comment: CommentObject | undefined = error ? { value: error.message, readOnly: true } : undefined;
    return { className: classNames, comment };
  };

  const columns: Handsontable.ColumnSettings[] = [
    {
      title: 'Parcel<br />Name',
      cells(row, col) {
        return generateCellProperties(row, col, 'parcel');
        // return { className: [getErrorClassForCell(row, col), getClassForValue('parcel', String(data[row][col]))] };
      },
    },
    {
      title: 'Container<br />Name',
      cells(row, col) {
        return generateCellProperties(row, col, 'container');

        //return { className: [getErrorClassForCell(row, col), getClassForValue('container', String(data[row][col]))] };
      },
    },
    { title: 'Container<br />Type' },
    { title: 'Container<br />Position' },
    {
      title: 'Protein<br />Acronym',
      cells(row, col) {
        return generateCellProperties(row, col, 'protein');

        //return { className: [getErrorClassForCell(row, col), getClassForValue('protein', String(data[row][col]))] };
      },
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

  return (
    <Row>
      <Col>
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

                  //   return { className: getErrorClassForCell(row, col), comment: { value: 'testtt' } };
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
          {errors.map((e) => (
            <Col key={e.message} md={'auto'}>
              <Alert style={{ marginTop: 5, padding: 5 }} variant={'danger'}>
                <FontAwesomeIcon style={{ marginRight: 5 }} icon={faExclamationTriangle}></FontAwesomeIcon>
                <strong>{e.message}</strong>
              </Alert>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}
