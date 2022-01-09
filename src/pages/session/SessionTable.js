import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import Loading from '../Loading.js';
import React from 'react';
import ResponsiveTable from 'components/table/responsivetable';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { toColumn } from 'components/table/helper';

const isEmpty = row => {
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

const rowStyle = row => (isEmpty(row) ? { color: '#B6B6B6', backgroundColor: '#F9F9F9' } : null);

export function SessionTable(props) {
  const { data, isMXenabled = true, isSAXSenabled = true, isEMenabled = true } = props;
  const getProposalName = row => {
    return row.Proposal_proposalCode + row.Proposal_ProposalNumber;
  };

  const dateFormatter = (cell, row, rowIndex, extraData) => {
    if (!extraData.isEmpty(row)) {
      if (cell !== null) {
        let link = `/sessions/mx/proposal/${extraData.getProposalName(row)}/session/${row.sessionId}/datasets`;
        if (row.beamLineName.toUpperCase() === 'BM29' || row.Proposal_ProposalType.toString().toUpperCase() === 'BX') {
          link = `/sessions/saxs/proposal/${extraData.getProposalName(row)}/session/${row.sessionId}/experiments`;
        }
        if (row.beamLineName.toUpperCase() === 'CM01' || row.Proposal_ProposalType.toString().toUpperCase() === 'EM') {
          link = `/sessions/em/proposal/${extraData.getProposalName(row)}/session/${row.sessionId}/datasets`;
        }
        return (
          <Link
            to={link}
            onClick={() => {
              extraData.props.setActiveSession(row.sessionId, cell);
            }}
          >
            {format(parse(cell, 'MMM d, yyyy h:mm:ss aaa', new Date()), 'dd/MM/yyyy')}
          </Link>
        );
      }
    }
    return format(parse(cell, 'MMM d, yyyy h:mm:ss aaa', new Date()), 'dd/MM/yyyy');
  };

  const statsFormatter = cell => (cell !== null && cell !== 0 ? <Badge>{cell}</Badge> : null);
  const proposalFormatter = (cell, row, rowIndex, extraData) => (cell !== null ? extraData.getProposalName(row) : null);
  const getHeaderStats = () => {
    return { xs: { hidden: true }, sm: { hidden: true }, md: { width: '30px', textAlign: 'center' }, lg: { width: '60px', textAlign: 'center' } };
  };

  function getColumns() {
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
          lg: { width: '80px', textAlign: 'center' }
        }
      },
      {
        text: 'Beamline',
        dataField: 'beamLineName',
        responsiveHeaderStyle: {
          xs: { width: '60px', textAlign: 'center' },
          sm: { width: '60px', textAlign: 'center' },
          md: { width: '60px', textAlign: 'center' },
          lg: { width: '60px', textAlign: 'center' }
        }
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
          lg: { width: '100px', textAlign: 'center' }
        }
      },
      {
        text: 'Local Contact',
        dataField: 'beamLineOperator',
        responsiveHeaderStyle: {
          xs: { hidden: true },
          sm: { hidden: true },
          md: { width: '100px', textAlign: 'center' },
          lg: { width: '140px', textAlign: 'center' }
        }
      },
      /** MX */
      toColumn('En. Scans', 'energyScanCount', statsFormatter, getHeaderStats(), !isMXenabled),
      toColumn('XRF', 'xrfSpectrumCount', statsFormatter, getHeaderStats(), !isMXenabled),
      toColumn('Samples', 'sampleCount', statsFormatter, getHeaderStats(), !isMXenabled),
      toColumn('Tests', 'testDataCollectionGroupCount', statsFormatter, getHeaderStats(), !isMXenabled),
      toColumn('Collects', 'dataCollectionGroupCount', statsFormatter, getHeaderStats(), !isMXenabled),
      /* SAXS */
      toColumn('Calibration', 'calibrationCount', statsFormatter, getHeaderStats(), !isSAXSenabled),
      toColumn('SC', 'sampleChangerCount', statsFormatter, getHeaderStats(), !isSAXSenabled),
      toColumn('HPLC', 'hplcCount', statsFormatter, getHeaderStats(), !isSAXSenabled),
      /* EM */
      toColumn('Grid Squares', 'EMdataCollectionGroupCount', statsFormatter, getHeaderStats(), !isEMenabled),
      {
        text: 'Comments',
        dataField: 'comments',
        responsiveHeaderStyle: { xs: { hidden: true }, sm: { hidden: true }, md: { width: '140px' }, lg: { width: '20%' } }
      }
    ];
  }

  return (
    <div>
      <ResponsiveTable
        rowStyle={rowStyle}
        pageOptions={{
          sizePerPage: 100
        }}
        search={false}
        keyField="id"
        data={data}
        columns={getColumns()}
      />
    </div>
  );
}
