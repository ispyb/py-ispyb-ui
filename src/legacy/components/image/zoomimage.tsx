import Zoom from 'react-medium-image-zoom';
import { Image, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import './zoomimage.css';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import { CSSProperties } from 'react';
import { useAuth } from 'hooks/useAuth';

interface props {
  src: string;
  alt?: string;
  style?: CSSProperties;
  lazy?: boolean;
  legend?: string;
}
export default function ZoomImage({
  src,
  alt,
  style,
  lazy = true,
  legend,
}: props) {
  const { site, token } = useAuth();

  const fullUrl = `${site.host}${site.apiPrefix}/${token}${src}`;

  const [error, setError] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const [img, setImg] = useState<JSX.Element | undefined>(undefined);

  useEffect(() => {
    setLoaded(false);
    setImg(
      <Image
        width="100%"
        thumbnail
        src={fullUrl}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    );
  }, [fullUrl, alt]);

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

  const placeholder = (
    <>
      <div className="zoom-image-placeholder">
        <Spinner animation="border" role="status" variant="dark"></Spinner>
      </div>
      {legend && <span>{legend}</span>}
    </>
  );
  if (lazy && !loaded) {
    return (
      <div style={style}>
        <LazyWrapper placeholder={placeholder}>
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
