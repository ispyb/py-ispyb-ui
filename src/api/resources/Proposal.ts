import createPaginatedResource from './Base/Paginated';
import { ProposalBase } from 'models/Proposal';

export class ProposalEntity extends ProposalBase {
  readonly proposal: string;

  pk() {
    return this.proposal;
  }
}

export const ProposalResource = createPaginatedResource({
  path: '/proposals/:proposal',
  schema: ProposalEntity,
});
