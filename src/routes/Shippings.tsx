import React from 'react';

const ShippingList = React.lazy(() =>
  import('components/Shippings' /* webpackChunkName: "shipping" */).then(
    (m) => ({
      default: m.ShippingList,
    })
  )
);

const ViewShipping = React.lazy(() =>
  import('components/Shippings').then((m) => ({
    default: m.ViewShipping,
  }))
);

const CreateShipping = React.lazy(() =>
  import('components/Shippings').then((m) => ({
    default: m.CreateShipping,
  }))
);

const ContactRoutes = {
  path: 'shipments',
  children: [
    { index: true, element: <ShippingList />, breadcrumb: 'Shipments' },
    { path: 'new', element: <CreateShipping />, breadcrumb: 'Create' },
    { path: ':shippingId', element: <ViewShipping />, breadcrumb: 'View' },
  ],
};

export default ContactRoutes;
