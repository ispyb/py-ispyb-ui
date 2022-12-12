import type {
  BreadcrumbComponentType,
  BreadcrumbMatch,
} from 'use-react-router-breadcrumbs';

import ContactRoutes from './Contacts';
import ShippingRoutes from './Shippings';
import EventsRoutes from './Events';
import StatsRoutes from './Stats';
import { SessionRoutes, CalendarRoutes } from './Proposals';
import SampleRoutes from './Samples';
import ProteinRoutes from './Proteins';

const ProposalBreadCrumb: BreadcrumbComponentType<'proposal'> = ({ match }) => {
  return <>{match.params.proposal}</>;
};

const ProposalRoutes = {
  path: 'proposals/:proposal',
  breadcrumb: ProposalBreadCrumb,
  titleBreadcrumb: ({ match }: { match: BreadcrumbMatch<string> }) =>
    match.params.proposal,
  children: [
    SessionRoutes,
    CalendarRoutes,
    SampleRoutes,
    ProteinRoutes,
    ContactRoutes,
    ShippingRoutes,
    EventsRoutes,
    StatsRoutes,
  ],
};

export default ProposalRoutes;
