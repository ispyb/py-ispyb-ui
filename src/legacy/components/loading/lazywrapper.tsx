import { PropsWithChildren, ReactNode, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';

export type LazyWrapperType = PropsWithChildren<{
  placeholder?: ReactNode;
  threshold?: number;
}> &
  ({ height?: number | string } | { aspectRatio?: string });

export default function LazyWrapper({
  children,
  placeholder,
  threshold = 1000,
  ...props
}: LazyWrapperType) {
  const { ref, inView } = useInView({
    rootMargin: `${threshold}px 0px`,
    triggerOnce: true,
  });

  // Lazy elements need to have a fixed height or an aspect ratio to have
  // consistent height when scrolling list of lazy elements
  const height = 'height' in props ? props.height : undefined;
  const aspectRatio = 'aspectRatio' in props ? props.aspectRatio : undefined;

  return (
    <div
      ref={ref}
      style={{
        height: height,
        aspectRatio: aspectRatio,
        width: '100%',
        overflowY: 'auto',
        overflowX: 'visible',
      }}
    >
      {!inView && placeholder}
      {inView && <Suspense fallback={placeholder}>{children}</Suspense>}
    </div>
  );
}
