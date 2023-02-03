import { useSuspense } from 'rest-hooks';

import { ProposalResource } from 'api/resources/Proposal';
import { Proposal } from 'models/Proposal';
import { useProposal } from './useProposal';

/**
 * Get the current proposal info
 */
export function useProposalInfo(): Proposal | undefined {
  const { proposalName } = useProposal();
  return useSuspense(
    ProposalResource.get,
    proposalName ? { proposal: proposalName } : null
  );
}
