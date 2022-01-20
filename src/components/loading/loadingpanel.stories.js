import React from 'react';
import LoadingPanel from 'components/loading/loadingpanel';

const l = { title: 'LoadingPanel', component: LoadingPanel };
export default l;

export const DefaultLoadingPanel = <LoadingPanel />;

export const MessageLoadingPAnel = () => <LoadingPanel text="Fetching data" />;
export const ChildrenLoadingPanel = () => (
  <LoadingPanel title="My second tag">
    <p>This is a child</p>
  </LoadingPanel>
);
