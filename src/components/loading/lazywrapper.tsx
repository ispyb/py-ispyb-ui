import React, { PropsWithChildren, ReactNode } from 'react';
import LazyLoad, { forceCheck } from 'react-lazyload';
import VisibilitySensor from 'react-visibility-sensor';

export type LazyWrapperType = PropsWithChildren<{
  placeholder?: ReactNode;
}>;

export default function LazyWrapper({ children, placeholder }: LazyWrapperType) {
  return (
    <VisibilitySensor onChange={forceCheck}>
      <LazyLoad placeholder={placeholder} offset={300}>
        {children}
      </LazyLoad>
    </VisibilitySensor>
  );
}
