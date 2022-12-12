import Calendar from 'components/Calendar';
import React from 'react';

const ProposalsList = React.lazy(() =>
  import('components/Proposals' /* webpackChunkName: "proposals" */).then(
    (m) => ({
      default: m.ProposalsList,
    })
  )
);

const SessionsList = React.lazy(() =>
  import('components/Proposals').then((m) => ({
    default: m.SessionsList,
  }))
);

export const SessionRoutes = {
  path: 'sessions',
  children: [
    { index: true, element: <SessionsList />, breadcrumb: 'Sessions' },
  ],
};

export const CalendarRoutes = {
  path: 'calendar',
  element: <Calendar />,
  breadcrumb: 'Calendar',
};

export const ProposalsRoutes = {
  path: 'proposals/list',
  children: [
    { index: true, element: <ProposalsList />, breadcrumb: 'Proposals' },
  ],
};
