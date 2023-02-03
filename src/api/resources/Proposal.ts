import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';
import { withProposal } from 'models/Proposal';

export class ProposalEntity extends Entity {
  readonly proposal: string;

  pk() {
    return this.proposal;
  }
}

export const ProposalResource = createPaginatedResource({
  path: '/proposals/:proposal',
  schema: withProposal(ProposalEntity),
});
