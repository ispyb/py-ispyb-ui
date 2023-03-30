import { useLabContacts } from 'legacy/hooks/ispyb';
import { Container } from 'react-bootstrap';
import { AddressesTable } from './addressestable';

export function AddressesTab({ proposalName }: { proposalName: string }) {
  const { data = [], isError, mutate } = useLabContacts({ proposalName });
  if (isError) throw Error(isError);

  return (
    <Container>
      <AddressesTable
        proposalName={proposalName}
        addresses={data}
        mutate={mutate}
      ></AddressesTable>
    </Container>
  );
}
