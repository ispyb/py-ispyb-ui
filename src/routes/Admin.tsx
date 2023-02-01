import React from 'react';
const Options = React.lazy(() =>
  import('components/Admin' /* webpackChunkName: "admin" */).then((m) => ({
    default: m.Options,
  }))
);

const AdminRoutes = {
  path: 'admin',
  breadcrumb: 'Admin',
  children: [{ path: 'options', element: <Options />, breadcrumb: 'Options' }],
};

export default AdminRoutes;
