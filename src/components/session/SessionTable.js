import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import Loading from '../Loading.js';
import React from 'react';
import ResponsiveTable from 'components/table/responsivetable';
//import format from 'date-fns/format';
//import parse from 'date-fns/parse';
import Moment from 'react-moment';

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
            <Moment parse="LLL" format="DD/MM/YYYY">
              ${cell}
            </Moment>
          </Link>
        );
      }
    }
    return (
      <Moment parse="LLL" format="DD/MM/YYYY">
        ${cell}
      </Moment>
    );
  };

  /*
     {format(
                parse(cell, 'MMM d, yyyy h:mm:ss aaa', new Date()),
                'dd/MM/yyyy'
              )}
              */

  const statsFormatter = cell => {
    if (cell !== null) {
      if (cell !== 0) {
        return <Badge>{cell}</Badge>;
      }
    }
    return null;
  };

  const proposalFormatter = (cell, row, rowIndex, extraData) => {
    if (cell !== null) {
      debugger;
      return extraData.getProposalName(row);
    }
  };
  /*
  const collapsedFormatter = (cell, row, rowIndex, extraData) => {
    if (cell !== null) {
      return extraData.getProposalName(row);
    }
  };*/

  const getHeaderStats = () => {
    return {
      xs: {
        hidden: true
      },
      sm: {
        hidden: true
      },
      md: {
        width: '30px',
        textAlign: 'center'
      },
      lg: {
        width: '60px',
        textAlign: 'center'
      }
    };
  };
  function getColumns() {
    return [
      {
        text: 'id',
        dataField: 'id',
        hidden: true
      },
      {
        text: 'Date',
        dataField: 'BLSession_startDate',
        formatter: dateFormatter,
        formatExtraData: { getProposalName, props, isEmpty },
        responsiveHeaderStyle: {
          xs: {
            width: '100px',
            textAlign: 'center'
          },
          sm: {
            width: '100px',
            textAlign: 'center'
          },
          md: {
            width: '80px',
            textAlign: 'center'
          },
          lg: {
            width: '80px',
            textAlign: 'center'
          }
        }
      },
      {
        text: 'Beamline',
        dataField: 'beamLineName',
        responsiveHeaderStyle: {
          xs: {
            width: '60px',
            textAlign: 'center'
          },
          sm: {
            width: '60px',
            textAlign: 'center'
          },
          md: {
            width: '60px',
            textAlign: 'center'
          },
          lg: {
            width: '60px',
            textAlign: 'center'
          }
        }
      },
      {
        text: 'Proposal',
        dataField: 'Proposal_proposalCode',
        formatter: proposalFormatter,
        formatExtraData: { getProposalName },
        responsiveHeaderStyle: {
          xs: {
            width: '140px',
            textAlign: 'center'
          },
          sm: {
            width: '140px',
            textAlign: 'center'
          },
          md: {
            width: '140px',
            textAlign: 'center'
          },
          lg: {
            width: '140px',
            textAlign: 'center'
          }
        }
      },
      {
        text: 'Local Contact',
        dataField: 'beamLineOperator',
        responsiveHeaderStyle: {
          xs: {
            hidden: true
          },
          sm: {
            hidden: true
          },
          md: {
            width: '100px',
            textAlign: 'center'
          },
          lg: {
            width: '140px',
            textAlign: 'center'
          }
        }
      },
      {
        text: 'En. Scans',
        dataField: 'energyScanCount',
        formatter: statsFormatter,
        responsiveHeaderStyle: getHeaderStats(),
        hidden: !isMXenabled
      },
      {
        text: 'XRF',
        dataField: 'xrfSpectrumCount',
        formatter: statsFormatter,
        responsiveHeaderStyle: getHeaderStats(),
        hidden: !isMXenabled
      },
      {
        text: 'Samples',
        dataField: 'sampleCount',
        formatter: statsFormatter,
        responsiveHeaderStyle: getHeaderStats(),
        hidden: !isMXenabled
      },
      {
        text: 'Tests',
        dataField: 'testDataCollectionGroupCount',
        formatter: statsFormatter,
        responsiveHeaderStyle: getHeaderStats(),
        hidden: !isMXenabled
      },
      {
        text: 'Collects',
        dataField: 'dataCollectionGroupCount',
        formatter: statsFormatter,
        responsiveHeaderStyle: getHeaderStats(),
        hidden: !isMXenabled
      },
      {
        text: 'Calibration',
        dataField: 'calibrationCount',
        formatter: statsFormatter,
        responsiveHeaderStyle: getHeaderStats(),
        hidden: !isSAXSenabled
      },
      {
        text: 'SC',
        dataField: 'sampleChangerCount',
        formatter: statsFormatter,
        responsiveHeaderStyle: getHeaderStats(),
        hidden: !isSAXSenabled
      },
      {
        text: 'HPLC',
        dataField: 'hplcCount',
        formatter: statsFormatter,
        responsiveHeaderStyle: getHeaderStats(),
        hidden: !isSAXSenabled
      },
      {
        text: 'Grid Squares',
        dataField: 'EMdataCollectionGroupCount',
        formatter: statsFormatter,
        responsiveHeaderStyle: getHeaderStats(),
        hidden: !isEMenabled
      },
      {
        text: 'Comments',
        dataField: 'comments',
        responsiveHeaderStyle: {
          xs: {
            hidden: true
          },
          sm: {
            hidden: true
          },
          md: {
            width: '140px'
          },
          lg: {
            width: '20%'
          }
        }
      }
    ];
  }

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

  const rowStyle = row => {
    if (isEmpty(row)) {
      return { color: '#B6B6B6', backgroundColor: '#F9F9F9' };
    }
  };

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
