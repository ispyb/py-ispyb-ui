interface ProposalData {
  /**
   * The proposal name
   */
  proposalName: string | null;
  setProposalName: (proposal: string) => void;
  clearProposal: () => void;
}

/**
 * Get and set the current proposal from localStorage
 */
export function useProposal(): ProposalData {
  const proposalName = window.localStorage.getItem('proposal') || '';

  const setProposalName = (proposal: string) => {
    window.localStorage.setItem('proposal', proposal);
  };

  const clearProposal = () => {
    setProposalName('');
  };

  return {
    proposalName,
    setProposalName,
    clearProposal,
  };
}
