import { useLabContacts } from 'hooks/ispyb';
import { AddressesTable } from './addressestable';

export function AddressesTab({ proposalName }: { proposalName: string }) {
  const { data = [], isError } = useLabContacts({ proposalName });
  if (isError) throw Error(isError);

  return <AddressesTable addresses={data}></AddressesTable>;
}
