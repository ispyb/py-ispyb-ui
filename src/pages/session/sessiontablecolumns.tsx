import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { toColumn } from 'components/table/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useGetTechniqueByBeamline } from 'hooks/site';
import { dateToTimestamp, formatDateTo } from 'helpers/dateparser';
import { Session } from 'pages/model';
import { OverlayChildren } from 'react-bootstrap/esm/Overlay';
import { ResponsiveColumnDescription } from 'hooks/bootstraptable';
import { textFilter } from 'react-bootstrap-table2-filter';

const dateFormatter = (cell: string, row: Session) => {
  return `${formatDateTo(cell, 'dd/MM/yyyy')} ⇨ ${formatDateTo(row.BLSession_endDate, 'dd/MM/yyyy')}`;
};

export function SessionSearch({ session }: { session: Session }) {
  const technique = useGetTechniqueByBeamline(session.beamLineName);
  const url = `/${session.Proposal_proposalCode}${session.Proposal_ProposalNumber}/${technique}/${session.sessionId}`;

  return (
    <OverlayTrigger placement="right" overlay={<Tooltip>Open session {session.sessionId}</Tooltip>}>
      <Button variant="link" href={url}>
        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
      </Button>
    </OverlayTrigger>
  );
}

const getProposalName = (row: Session) => {
  return row.Proposal_proposalCode + row.Proposal_ProposalNumber;
};
const statsFormatter = (cell: number) => (cell !== null && cell !== 0 ? <Badge>{cell}</Badge> : null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proposalFormatter = (cell: string, row: Session, rowIndex: number, extraData: any) => {
  const { userPortalLink } = extraData;

  const renderTooltip: OverlayChildren = (props) => (
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
  return {
    xs: { hidden: true },
    sm: { hidden: true },
    md: { width: '30px', textAlign: 'center', verticalAlign: 'sub' },
    lg: { width: '60px', textAlign: 'center', verticalAlign: 'sub' },
  };
};

interface Props {
  areMXColumnsVisible: boolean;
  areSAXSColumnsVisible: boolean;
  areEMColumnsVisible: boolean;
  userPortalLink: { visible: boolean; header: string; url: string; toolTip: string };
}
export default function columns(props: Props): ResponsiveColumnDescription<Session>[] {
  const { areMXColumnsVisible, areSAXSColumnsVisible, areEMColumnsVisible, userPortalLink } = props;
  return [
    { text: 'id', dataField: 'sessionId', hidden: true },
    {
      text: '',
      dataField: 'sessionId',
      formatter: (cell, row) => <SessionSearch session={row}></SessionSearch>,
      responsiveHeaderStyle: {
        xs: { width: '56px' },
        sm: { width: '56px' },
        md: { width: '56px' },
        lg: { width: '56px' },
      },
      style: { verticalAlign: 'middle', textAlign: 'center', width: '56px' },
    },
    {
      text: 'Date',
      dataField: 'BLSession_startDate',
      sort: true,
      formatter: dateFormatter,
      sortValue: (cell) => dateToTimestamp(cell),
      responsiveHeaderStyle: {
        xs: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
        sm: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
        md: { width: '80px', textAlign: 'center', verticalAlign: 'sub' },
        lg: { width: '80px', textAlign: 'center', verticalAlign: 'sub' },
      },
    },
    {
      text: 'Beamline',
      dataField: 'beamLineName',
      sort: true,
      filter: textFilter({
        placeholder: 'Search...',
      }),
      responsiveHeaderStyle: {
        xs: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
        sm: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
        md: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
        lg: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
      },
    },
    {
      text: 'Proposal',
      sort: true,
      dataField: 'Proposal_proposalCode',
      formatter: proposalFormatter,
      formatExtraData: { getProposalName, userPortalLink },
      filter: textFilter({
        placeholder: 'Search...',
      }),
      responsiveHeaderStyle: {
        xs: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
        sm: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
        md: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
        lg: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
      },
    },

    {
      text: 'Local Contact',
      sort: true,
      dataField: 'beamLineOperator',
      filter: textFilter({
        placeholder: 'Search...',
      }),
      responsiveHeaderStyle: {
        xs: { hidden: true },
        sm: { hidden: true },
        md: { width: '100px', textAlign: 'center', verticalAlign: 'sub' },
        lg: { width: '140px', textAlign: 'center', verticalAlign: 'sub' },
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
      filter: textFilter({
        placeholder: 'Search...',
      }),
      responsiveHeaderStyle: {
        xs: { hidden: true },
        sm: { hidden: true },
        md: { width: '140px', textAlign: 'center', verticalAlign: 'sub' },
        lg: { width: '20%', textAlign: 'center', verticalAlign: 'sub' },
      },
    },
  ];
}
