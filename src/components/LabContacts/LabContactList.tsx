import { useSuspense } from 'rest-hooks';

import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Table from 'components/Layout/Table';
import { LabContactResource } from 'api/resources/LabContact';
import { LabContact } from 'models/LabContact';
import { PersonPlus } from 'react-bootstrap-icons';
import { usePath } from 'hooks/usePath';

function personFormatter(row: LabContact) {
  return `${row.Person.givenName} ${row.Person.familyName}`;
}

export default function LabContactList() {
  const navigate = useNavigate();
  const proposal = usePath('proposal');
  const contacts = useSuspense(LabContactResource.list(), {
    ...(proposal ? { proposal } : {}),
  });

  const onRowClick = (row: LabContact) => {
    navigate(`/proposals/${proposal}/contacts/${row.labContactId}`);
  };

  return (
    <section>
      <h1 className="clearfix">
        Lab Contacts
        <div className="float-end">
          <Button
            onClick={() => navigate(`/proposals/${proposal}/contacts/new`)}
          >
            <PersonPlus className="me-1" /> New
          </Button>
        </div>
      </h1>

      <Table
        onRowClick={onRowClick}
        keyId="labContactId"
        paginator={{
          total: contacts.total,
          skip: contacts.skip,
          limit: contacts.limit,
        }}
        results={contacts.results}
        columns={[
          { label: 'Card Name', key: 'cardName' },
          { label: 'Date', key: 'recordTimeStamp' },
          {
            label: 'Contact Person',
            key: 'person',
            formatter: personFormatter,
          },
          {
            label: 'Laboratory',
            key: 'Person.Laboratory.name',
          },
        ]}
        emptyText="No lab contact yet"
      />
    </section>
  );
}
