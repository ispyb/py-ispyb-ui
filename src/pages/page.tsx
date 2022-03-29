import LoadingPanel from 'components/loading/loadingpanel';
import React, { PropsWithChildren, Suspense } from 'react';
import Menu from './menu/menu';

export default function Page({ children, selected }: PropsWithChildren<{ selected: string }>) {
  console.log(selected);
  return (
    <>
      <Menu selected={selected} />
      <div style={{ fontSize: 13, marginTop: 120, marginRight: 10, marginLeft: 10 }}>
        <Suspense fallback={<LoadingPanel></LoadingPanel>}> {children}</Suspense>
      </div>
    </>
  );
}
