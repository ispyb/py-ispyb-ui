import Zoom from 'react-medium-image-zoom';
import { Image, Spinner } from 'react-bootstrap';
import { useState } from 'react';

import './zoomimage.css';
import LazyWrapper from 'components/loading/lazywrapper';

const placeholder = (
  <div className="zoom-image-placeholder">
    <Spinner animation="border" role="status" variant="dark"></Spinner>
  </div>
);

interface props {
  src: string;
  alt?: string;
}
export default function ZoomImage({ src, alt }: props) {
  const [error, setError] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const [img] = useState(<Image width="100%" thumbnail src={src} alt={alt} onLoad={() => setLoaded(true)} onError={() => setError(true)} />);

  if (error) {
    return (
      <div className="zoom-image-alt">
        <p>{alt} not found</p>
      </div>
    );
  }
  if (!loaded) {
    return (
      <>
        {placeholder}
        <LazyWrapper>
          <div style={{ display: 'none' }}>{img}</div>
        </LazyWrapper>
      </>
    );
  }
  return (
    <div className="zoomimage" style={{ margin: 5 }}>
      <LazyWrapper placeholder={placeholder}>
        <Zoom>{img}</Zoom>
      </LazyWrapper>
    </div>
  );
}
