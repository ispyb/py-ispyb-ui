import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import React, { PropsWithChildren, Suspense } from 'react';
import Menu from './menu/menu';

export default function Page({ children, selected }: PropsWithChildren<{ selected: string }>) {
  return (
    <>
      <Suspense fallback={<></>}>
        <Menu selected={selected} />
      </Suspense>
      <div style={{ fontSize: 13, marginTop: 120, marginRight: 10, marginLeft: 10 }}>
        <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>{children}</Suspense>
        </LazyWrapper>
      </div>
    </>
  );
}
