import { useSuspense } from 'rest-hooks';

import { ProposalResource } from 'api/resources/Proposal';
import { Proposal } from 'models/Proposal';
import { useParams } from 'react-router-dom';

/**
 * Get the current proposal info
 */
export function useProposalInfo(): Proposal | undefined {
  const { proposalName } = useParams();
  return useSuspense(
    ProposalResource.get,
    proposalName ? { proposal: proposalName } : null
  );
}
