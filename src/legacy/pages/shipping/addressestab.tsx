import { useLabContacts } from 'legacy/hooks/ispyb';
import { AddressesTable } from './addressestable';

export function AddressesTab({ proposalName }: { proposalName: string }) {
  const { data = [], isError, mutate } = useLabContacts({ proposalName });
  if (isError) throw Error(isError);

  return (
    <AddressesTable
      proposalName={proposalName}
      addresses={data}
      mutate={mutate}
    ></AddressesTable>
  );
}
