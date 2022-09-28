import Zoom from 'react-medium-image-zoom';
import { Image, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import './zoomimage.css';
import LazyWrapper from 'components/loading/lazywrapper';
import { CSSProperties } from 'react';
import { RequestInformation } from 'api/pyispyb';
import axios from 'axios';
import VisibilitySensor from 'react-visibility-sensor';

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

  const [img, setImg] = useState<JSX.Element | undefined>(undefined);

  useEffect(() => {
    setLoaded(false);
    setImg(<Image width="100%" thumbnail src={src} alt={alt} onLoad={() => setLoaded(true)} onError={() => setError(true)} />);
  }, [src]);

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

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
function getObjectURL(src: RequestInformation, error: (error: any) => void, success: (value: string) => void) {
  axios
    .get(src.url, {
      headers: { Authorization: `Bearer ${src.token}` },
      responseType: 'blob',
    })
    .catch(error)
    .then((response) => {
      if (response) {
        const v = URL.createObjectURL(response.data);
        success(v);
      }
    });
}

export function ZoomImageBearer({ src, alt, style, lazy = true, legend }: { src: RequestInformation; alt?: string; style?: CSSProperties; lazy?: boolean; legend?: string }) {
  const [error, setError] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const [value, setValue] = useState('');

  const onVisible = (visible: boolean) => {
    console.log(visible);
    if (visible) {
      getObjectURL(
        src,
        () => {
          setError(true);
        },
        (value) => {
          setValue(value);
          setLoaded(true);
        }
      );
    }
  };

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
      <VisibilitySensor onChange={onVisible}>
        <div style={style}>
          {placeholder}
          {legend && <span>{legend}</span>}
        </div>
      </VisibilitySensor>
    );
  }
  return (
    <div className="zoomimage" style={style}>
      <Zoom>
        <Image width="100%" thumbnail alt={alt} src={value}></Image>
      </Zoom>
      {legend && <span>{legend}</span>}
    </div>
  );
}
