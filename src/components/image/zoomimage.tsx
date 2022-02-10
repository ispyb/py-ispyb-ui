import Zoom from 'react-medium-image-zoom';
import { Image } from 'react-bootstrap';
import LazyLoad from 'react-lazyload';

interface props {
  src: string;
  alt?: string;
}
export default function ZoomImage({ src, alt }: props) {
  return (
    <div style={{ margin: 5 }}>
      <LazyLoad>
        <Zoom>
          <Image thumbnail src={src} alt={alt} />
        </Zoom>
      </LazyLoad>
    </div>
  );
}
