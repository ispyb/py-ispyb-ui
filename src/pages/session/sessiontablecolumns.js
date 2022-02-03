import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { toColumn } from 'components/table/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useGetTechniqueByBeamline } from 'hooks/site';

const dateFormatter = (cell, row) => {
  const technique = useGetTechniqueByBeamline(row.beamLineName);
  const url = `/${technique}/${row.sessionId}`;
  //return <Link to={url}>{format(parse(cell, 'MMM d, yyyy h:mm:ss aaa', new Date()), 'dd/MM/yyyy')}</Link>;
  return 'asd';
};

const getProposalName = (row) => {
  return row.Proposal_proposalCode + row.Proposal_ProposalNumber;
};
const statsFormatter = (cell) => (cell !== null && cell !== 0 ? <Badge>{cell}</Badge> : null);

const proposalFormatter = (cell, row, rowIndex, extraData) => {
  const { userPortalLink } = extraData;

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {userPortalLink.toolTip}
    </Tooltip>
  );

  if (cell !== null) {
    if (userPortalLink.visible) {
      return (
        <>
          <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
            <a href={userPortalLink.url + row.expSessionPk}>
              <FontAwesomeIcon icon={faBook} style={{ marginRight: 10 }}></FontAwesomeIcon>
            </a>
          </OverlayTrigger>
          {extraData.getProposalName(row)}
        </>
      );
    }
    return extraData.getProposalName(row);
  }

  return;
};

const getHeaderStats = () => {
  return { xs: { hidden: true }, sm: { hidden: true }, md: { width: '30px', textAlign: 'center' }, lg: { width: '60px', textAlign: 'center' } };
};

export default function columns(props) {
  const { areMXColumnsVisible, areSAXSColumnsVisible, areEMColumnsVisible, userPortalLink } = props;
  return [
    { text: 'id', dataField: 'id', hidden: true },
    {
      text: 'Date',
      dataField: 'BLSession_startDate',
      sort: true,
      formatter: dateFormatter,
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
      sort: true,
      responsiveHeaderStyle: {
        xs: { width: '60px', textAlign: 'center' },
        sm: { width: '60px', textAlign: 'center' },
        md: { width: '60px', textAlign: 'center' },
        lg: { width: '60px', textAlign: 'center' },
      },
    },
    {
      text: 'Proposal',
      sort: true,
      dataField: 'Proposal_proposalCode',
      formatter: proposalFormatter,
      formatExtraData: { getProposalName, userPortalLink },
      responsiveHeaderStyle: {
        xs: { width: '100px', textAlign: 'center' },
        sm: { width: '100px', textAlign: 'center' },
        md: { width: '100px', textAlign: 'center' },
        lg: { width: '100px', textAlign: 'center' },
      },
    },

    {
      text: 'Local Contact',
      sort: true,
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
