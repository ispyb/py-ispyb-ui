import { Proposal } from 'legacy/pages/model';
import React from 'react';
import { Badge, Button, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useProposal } from 'hooks/useProposal';
import { useNavigate } from 'react-router-dom';

export default function ProposalTable({
  data,
}: {
  data: Proposal[];
  variant: 'sessions' | 'experiments';
}) {
  const columns: ColumnDescription[] = [
    { text: 'id', dataField: 'Proposal_proposalId', hidden: true },
    {
      text: '',
      dataField: 'Proposal_proposalId',
      formatter: (cell, row) => {
        return <ProposalSessions proposal={row}></ProposalSessions>;
      },
      headerStyle: { width: 56 },
      style: { verticalAlign: 'middle', textAlign: 'center' },
    },
    {
      text: 'Proposal',
      dataField: '',
      filter: textFilter({
        placeholder: 'Search...',
      }),
      sort: true,
      sortValue: (cell, row) =>
        `${row.Proposal_proposalCode}${row.Proposal_proposalNumber}`,
      filterValue: (cell, row) =>
        `${row.Proposal_proposalCode}${row.Proposal_proposalNumber}`,
      formatter: (cell, row) => <ProposalName proposal={row}></ProposalName>,
      headerStyle: { textAlign: 'center', verticalAlign: 'sub' },
      style: { verticalAlign: 'middle' },
    },
    {
      text: 'Title',
      dataField: 'Proposal_title',
      filter: textFilter({
        placeholder: 'Search...',
      }),
      sort: true,
      headerStyle: { textAlign: 'center', verticalAlign: 'sub' },
      style: { verticalAlign: 'middle' },
    },
  ];

  return (
    <Row style={{ maxWidth: 1000, margin: 'auto' }}>
      <BootstrapTable
        bootstrap4
        wrapperClasses="table-responsive"
        keyField="Id"
        data={data}
        columns={columns}
        pagination={paginationFactory({ showTotal: true })}
        filter={filterFactory()}
      />
    </Row>
  );
}

export function ProposalName({ proposal }: { proposal: Proposal }) {
  return (
    <>
      <p style={{ fontSize: 15, fontWeight: 'bold', margin: 'auto' }}>
        <Badge
          bg="secondary"
          style={{ marginRight: 5 }}
        >{`${proposal.Proposal_proposalType}`}</Badge>
        {`${proposal.Proposal_proposalCode}${proposal.Proposal_proposalNumber}`}
      </p>
    </>
  );
}

export function ProposalSessions({ proposal }: { proposal: Proposal }) {
  const { setProposalName } = useProposal();
  const navigate = useNavigate();
  const proposalName = `${proposal.Proposal_proposalCode}${proposal.Proposal_proposalNumber}`;
  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip>Search sessions for {proposalName}</Tooltip>}
    >
      <Button
        variant="link"
        onClick={() => {
          setProposalName(proposalName);
          navigate(`/legacy/proposals/${proposalName}/sessions`);
        }}
      >
        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
      </Button>
    </OverlayTrigger>
  );
}
