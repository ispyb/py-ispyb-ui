import React from 'react';
import SiteSelector from 'components/login/siteselector';
import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';

const l = { title: 'SiteSelector', component: SiteSelector };
export default l;

const Story = () => (
  <Provider store={store}>
    <BrowserRouter>
      <SiteSelector />
    </BrowserRouter>
  </Provider>
);

export const SiteSelectorComponent = Story.bind({});
