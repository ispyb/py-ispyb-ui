import Zoom from 'react-medium-image-zoom';
import { Image } from 'react-bootstrap';
import LazyLoad from 'react-lazyload';
import { useState } from 'react';

import './zoomimage.css';

interface props {
  src: string;
  alt?: string;
}
export default function ZoomImage({ src, alt }: props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="zoom-image-alt">
        <p>{alt} not found</p>
      </div>
    );
  }
  return (
    <div className="zoomimage" style={{ margin: 5 }}>
      <LazyLoad height="100%" offset={300}>
        <Zoom>
          <Image width="100%" thumbnail src={src} alt={alt} onError={() => setError(true)} />
        </Zoom>
      </LazyLoad>
    </div>
  );
}
