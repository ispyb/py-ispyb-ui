import Zoom from 'react-medium-image-zoom';
import { Image, Spinner } from 'react-bootstrap';
import { useState } from 'react';

import './zoomimage.css';
import LazyWrapper from 'components/loading/lazywrapper';
import { CSSProperties } from 'react';

const placeholder = (
  <div className="zoom-image-placeholder">
    <Spinner animation="border" role="status" variant="dark"></Spinner>
  </div>
);

interface props {
  src: string;
  alt?: string;
  style?: CSSProperties;
  lazy?: boolean;
  legend?: string;
}
export default function ZoomImage({ src, alt, style, lazy = true, legend }: props) {
  const [error, setError] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const [img] = useState(<Image width="100%" thumbnail src={src} alt={alt} onLoad={() => setLoaded(true)} onError={() => setError(true)} />);

  if (error) {
    return (
      <>
        <div style={style} className="zoom-image-alt">
          <p>{alt} not found</p>
        </div>
        {legend && <span>{legend}</span>}
      </>
    );
  }
  if (lazy && !loaded) {
    return (
      <div style={style}>
        {placeholder}
        {legend && <span>{legend}</span>}
        <LazyWrapper>
          <div style={{ display: 'none' }}>{img}</div>
        </LazyWrapper>
      </div>
    );
  }
  return (
    <div className="zoomimage" style={style}>
      <Zoom>{img}</Zoom>
      {legend && <span>{legend}</span>}
    </div>
  );
}
