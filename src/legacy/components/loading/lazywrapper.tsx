import { PropsWithChildren, ReactNode, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';

export type LazyWrapperType = PropsWithChildren<{
  placeholder?: ReactNode;
}>;

export default function LazyWrapper({
  children,
  placeholder,
}: LazyWrapperType) {
  const { ref, inView } = useInView({
    rootMargin: '1000px 0px',
    triggerOnce: true,
  });

  if (inView) return <>{children}</>;

  return (
    <div ref={ref}>
      <Suspense fallback={placeholder}>{placeholder}</Suspense>
    </div>
  );
}
