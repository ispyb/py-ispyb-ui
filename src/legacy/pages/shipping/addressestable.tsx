import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TanstackBootstrapTable } from 'components/Layout/TanstackBootstrapTable';
import { useMemo, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { KeyedMutator } from 'swr';
import AddressModal from './addressmodal';
import { LabContact } from './model';

type LabContactExt = LabContact & {
  familyName?: string;
  givenName?: string;
  email?: string;
};

export function AddressesTable({
  addresses,
  proposalName,
  mutate,
}: {
  addresses: LabContact[];
  proposalName: string;
  mutate: KeyedMutator<LabContact[]>;
}) {
  const data = useMemo(
    () =>
      addresses.map((v) => {
        const res: LabContactExt = v;
        res.email = v.personVO.emailAddress;
        res.givenName = v.personVO.givenName;
        res.familyName = v.personVO.familyName;
        return res;
      }),
    [addresses]
  );

  const columns: ColumnDef<LabContactExt>[] = [
    {
      id: 'edit',
      header: '',
      accessorKey: 'labContactId',
      cell: (info) => (
        <EditAddressButton
          mutate={mutate}
          proposalName={proposalName}
          labContact={info.row.original}
        />
      ),
      enableColumnFilter: false,
    },
    {
      header: 'Address',
      footer: 'Address',
      accessorKey: 'cardName',
    },
    {
      header: 'Surname',
      footer: 'Surname',
      accessorKey: 'familyName',
    },
    {
      header: 'Name',
      footer: 'Name',
      accessorKey: 'givenName',
    },
    {
      header: 'Email',
      footer: 'Email',
      accessorKey: 'email',
    },
  ];
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });
  return (
    <Row>
      <TanstackBootstrapTable table={table} />
    </Row>
  );
}

export function EditAddressButton({
  labContact,
  proposalName,
  mutate,
}: {
  labContact: LabContact;
  proposalName: string;
  mutate: KeyedMutator<LabContact[]>;
}) {
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
      <AddressModal
        mutate={mutate}
        proposalName={proposalName}
        address={labContact}
        show={modalShow}
        onHide={() => setModalShow(false)}
      ></AddressModal>
    </>
  );
}
