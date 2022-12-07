import React, { PropsWithChildren, ReactNode, useState } from 'react';
import LazyLoad from 'react-lazy-load';

export type LazyWrapperType = PropsWithChildren<{
  placeholder?: ReactNode;
}>;

export default function LazyWrapper({
  children,
  placeholder,
}: LazyWrapperType) {
  const [loaded, setLoaded] = useState(false);
  if (loaded) return <>{children}</>;
  return (
    <>
      <LazyLoad height={0} onContentVisible={() => setLoaded(true)}>
        <></>
      </LazyLoad>
      {placeholder}
    </>
  );
}
