import React from 'react';
import { useProposals } from 'legacy/hooks/ispyb';
import ProposalTable from './proposal/proposaltable';

export default function ProposalsPage() {
  const { data, isError } = useProposals();
  if (isError) throw Error(isError);
  if (!data) throw Error('error while fetching proposals');

  return <ProposalTable variant="sessions" data={data}></ProposalTable>;
}
