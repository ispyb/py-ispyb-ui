import React from 'react';
import LoginTabs from 'components/login/logintabs';
import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';

const l = { title: 'LoginTabs', component: LoginTabs };
export default l;

const Story = () => (
  <Provider store={store}>
    <BrowserRouter>
      <LoginTabs />
    </BrowserRouter>
  </Provider>
);

export const LoginTabsComponent = Story.bind({});
