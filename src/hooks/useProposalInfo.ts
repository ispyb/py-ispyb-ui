import { useSuspense } from 'rest-hooks';

import { ProposalResource } from 'api/resources/Proposal';
import { Proposal } from 'models/Proposal.d';
import { useProposal } from './useProposal';

/**
 * Get the current proposal info
 */
export function useProposalInfo(): Proposal {
  const { proposalName } = useProposal();
  return useSuspense(
    ProposalResource.detail(),
    proposalName ? { proposal: proposalName } : null
  );
}
