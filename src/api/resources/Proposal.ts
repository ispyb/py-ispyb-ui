import PaginatedResource from 'api/resources/Base/Paginated';
import { withProposal } from 'models/Proposal.d';

export class _ProposalResource extends PaginatedResource {
  readonly proposal: string;

  pk() {
    return this.proposal;
  }
  static urlRoot = 'proposals';
}

export const ProposalResource = withProposal(_ProposalResource);
