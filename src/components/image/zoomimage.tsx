import Zoom from 'react-medium-image-zoom';
import { Image } from 'react-bootstrap';
import LazyLoad from 'react-lazyload';

interface props {
  src: string;
}
export default function ZoomImage({ src }: props) {
  return (
    <div style={{ margin: 5 }}>
      <LazyLoad>
        <Zoom>
          <Image thumbnail src={src} />
        </Zoom>
      </LazyLoad>
    </div>
  );
}
