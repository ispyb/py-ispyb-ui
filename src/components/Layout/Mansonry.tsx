import classNames from 'classnames';
import Masonry from 'react-masonry-css';

import './mansonry.scss';

interface MasonryLayoutProps {
  breakpointCols?:
    | number
    | { default: number; [key: number]: number }
    | { [key: number]: number };
  columnClassName?: string;
  className?: string;
  children: React.ReactElement[];
  separator?: boolean;
}

export default function MasonryLayout(props: MasonryLayoutProps) {
  return (
    <Masonry
      {...props}
      className={`masonry-grid ${props.className}`}
      columnClassName={classNames([
        {
          'masonry-grid-column': true,
          'masonry-grid-separator': props.separator,
        },
        props.columnClassName,
      ])}
    >
      {props.children.map((c) => (
        <div>{c}</div>
      ))}
    </Masonry>
  );
}
