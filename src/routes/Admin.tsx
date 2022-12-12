import Options from 'components/Admin/Options';

const AdminRoutes = {
  path: 'admin',
  breadcrumb: 'Admin',
  children: [{ path: 'options', element: <Options />, breadcrumb: 'Options' }],
};

export default AdminRoutes;
