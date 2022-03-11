import React, { PropsWithChildren, ReactNode } from 'react';
import LazyLoad, { forceCheck } from 'react-lazyload';
import VisibilitySensor from 'react-visibility-sensor';

export type LazyWrapperType = PropsWithChildren<{
  placeholder?: ReactNode;
}>;

function forceCheckIfVisible(isVisible: boolean) {
  if (isVisible) {
    forceCheck();
  }
}

export default function LazyWrapper({ children, placeholder }: LazyWrapperType) {
  return (
    // LazyLoad only takes into account scroll events -> elements do not load on tab change
    // ===> fix by combination with VisibilitySensor
    <VisibilitySensor onChange={forceCheckIfVisible}>
      <LazyLoad once placeholder={placeholder} offset={500}>
        {children}
      </LazyLoad>
    </VisibilitySensor>
  );
}
