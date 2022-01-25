import React from 'react';
import { Badge } from 'react-bootstrap';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { toColumn } from 'components/table/helper';

const dateFormatter = (cell) => {
  return format(parse(cell, 'MMM d, yyyy h:mm:ss aaa', new Date()), 'dd/MM/yyyy');
};
const getProposalName = (row) => {
  return row.Proposal_proposalCode + row.Proposal_ProposalNumber;
};
const statsFormatter = (cell) => (cell !== null && cell !== 0 ? <Badge>{cell}</Badge> : null);
const proposalFormatter = (cell, row, rowIndex, extraData) => (cell !== null ? extraData.getProposalName(row) : null);
const getHeaderStats = () => {
  return { xs: { hidden: true }, sm: { hidden: true }, md: { width: '30px', textAlign: 'center' }, lg: { width: '60px', textAlign: 'center' } };
};

const isEmpty = (row) => {
  function checkNonZero(value) {
    return !value || value === 0;
  }
  return (
    checkNonZero(row.energyScanCount) &&
    checkNonZero(row.xrfSpectrumCount) &&
    checkNonZero(row.EMdataCollectionGroupCount) &&
    checkNonZero(row.hplcCount) &&
    checkNonZero(row.sampleChangerCount) &&
    checkNonZero(row.calibrationCount) &&
    checkNonZero(row.dataCollectionGroupCount) &&
    checkNonZero(row.testDataCollectionGroupCount) &&
    checkNonZero(row.sampleCount) &&
    checkNonZero(row.xrfSpectrumCount) &&
    checkNonZero(row.energyScanCount)
  );
};

export default function columns(props, areMXColumnsVisible, areSAXSColumnsVisible, areEMColumnsVisible) {
  return [
    { text: 'id', dataField: 'id', hidden: true },
    {
      text: 'Date',
      dataField: 'BLSession_startDate',
      formatter: dateFormatter,
      formatExtraData: { getProposalName, props, isEmpty },
      responsiveHeaderStyle: {
        xs: { width: '100px', textAlign: 'center' },
        sm: { width: '100px', textAlign: 'center' },
        md: { width: '80px', textAlign: 'center' },
        lg: { width: '80px', textAlign: 'center' },
      },
    },
    {
      text: 'Beamline',
      dataField: 'beamLineName',
      responsiveHeaderStyle: {
        xs: { width: '60px', textAlign: 'center' },
        sm: { width: '60px', textAlign: 'center' },
        md: { width: '60px', textAlign: 'center' },
        lg: { width: '60px', textAlign: 'center' },
      },
    },
    {
      text: 'Proposal',
      dataField: 'Proposal_proposalCode',
      formatter: proposalFormatter,
      formatExtraData: { getProposalName },
      responsiveHeaderStyle: {
        xs: { width: '100px', textAlign: 'center' },
        sm: { width: '100px', textAlign: 'center' },
        md: { width: '100px', textAlign: 'center' },
        lg: { width: '100px', textAlign: 'center' },
      },
    },
    {
      text: 'Local Contact',
      dataField: 'beamLineOperator',
      responsiveHeaderStyle: {
        xs: { hidden: true },
        sm: { hidden: true },
        md: { width: '100px', textAlign: 'center' },
        lg: { width: '140px', textAlign: 'center' },
      },
    },
    /** MX */
    toColumn('En. Scans', 'energyScanCount', statsFormatter, getHeaderStats(), !areMXColumnsVisible),
    toColumn('XRF', 'xrfSpectrumCount', statsFormatter, getHeaderStats(), !areMXColumnsVisible),
    toColumn('Samples', 'sampleCount', statsFormatter, getHeaderStats(), !areMXColumnsVisible),
    toColumn('Tests', 'testDataCollectionGroupCount', statsFormatter, getHeaderStats(), !areMXColumnsVisible),
    toColumn('Collects', 'dataCollectionGroupCount', statsFormatter, getHeaderStats(), !areMXColumnsVisible),
    /* SAXS */
    toColumn('Calibration', 'calibrationCount', statsFormatter, getHeaderStats(), !areSAXSColumnsVisible),
    toColumn('SC', 'sampleChangerCount', statsFormatter, getHeaderStats(), !areSAXSColumnsVisible),
    toColumn('HPLC', 'hplcCount', statsFormatter, getHeaderStats(), !areSAXSColumnsVisible),
    /* EM */
    toColumn('Grid Squares', 'EMdataCollectionGroupCount', statsFormatter, getHeaderStats(), !areEMColumnsVisible),
    {
      text: 'Comments',
      dataField: 'comments',
      responsiveHeaderStyle: { xs: { hidden: true }, sm: { hidden: true }, md: { width: '140px' }, lg: { width: '20%' } },
    },
  ];
}
