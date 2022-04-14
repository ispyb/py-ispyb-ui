import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { KeyedMutator } from 'swr';
import AddressModal from './addressmodal';
import { LabContact } from './model';

type LabContactExt = LabContact & {
  familyName?: string;
  givenName?: string;
  email?: string;
};

export function AddressesTable({ addresses, proposalName, mutate }: { addresses: LabContact[]; proposalName: string; mutate: KeyedMutator<LabContact[]> }) {
  const data = addresses.map((v) => {
    const res: LabContactExt = v;
    res.email = v.personVO.emailAddress;
    res.givenName = v.personVO.givenName;
    res.familyName = v.personVO.familyName;
    return res;
  });

  const columns: ColumnDescription[] = [
    { text: 'id', dataField: 'labContactId', hidden: true },
    {
      text: '',
      dataField: 'labContactId',
      formatter: (cell, row) => {
        return <EditAddressButton mutate={mutate} proposalName={proposalName} labContact={row}></EditAddressButton>;
      },
      headerStyle: { width: 56 },
      style: { padding: 0, verticalAlign: 'middle', textAlign: 'center' },
    },
    {
      text: 'Address',
      dataField: 'cardName',
      headerStyle: { textAlign: 'center', verticalAlign: 'sub' },
      filter: textFilter({
        placeholder: 'Search...',
      }),
      sort: true,
    },
    {
      text: 'Surname',
      dataField: 'familyName',
      headerStyle: { textAlign: 'center', verticalAlign: 'sub' },
      style: { verticalAlign: 'middle', textAlign: 'center' },
      filter: textFilter({
        placeholder: 'Search...',
      }),
      sort: true,
    },
    {
      text: 'Name',
      dataField: 'givenName',
      headerStyle: { textAlign: 'center', verticalAlign: 'sub' },
      style: { verticalAlign: 'middle', textAlign: 'center' },
      filter: textFilter({
        placeholder: 'Search...',
      }),
      sort: true,
    },
    {
      text: 'Email',
      dataField: 'email',
      headerStyle: { textAlign: 'center', verticalAlign: 'sub' },
      style: { verticalAlign: 'middle', textAlign: 'center' },
      filter: textFilter({
        placeholder: 'Search...',
      }),
      sort: true,
    },
  ];

  return (
    <Row>
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

export function EditAddressButton({ labContact, proposalName, mutate }: { labContact: LabContact; proposalName: string; mutate: KeyedMutator<LabContact[]> }) {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Button
        variant="link"
        onClick={() => {
          setModalShow(true);
        }}
      >
        <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
      </Button>
      <AddressModal mutate={mutate} proposalName={proposalName} address={labContact} show={modalShow} onHide={() => setModalShow(false)}></AddressModal>
    </>
  );
}
