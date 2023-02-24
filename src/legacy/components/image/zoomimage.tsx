import Zoom from 'react-medium-image-zoom';
import { Image, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import './zoomimage.css';
import 'react-medium-image-zoom/dist/styles.css';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import { CSSProperties } from 'react';
import { useAuth } from 'hooks/useAuth';
import { Dataset, getDatasetParam } from 'legacy/hooks/icatmodel';
import { getIcatGalleryDownloadUrl } from 'legacy/hooks/icat';

interface props {
  src: string;
  alt?: string;
  style?: CSSProperties;
  lazy?: boolean;
  legend?: string;
  local?: boolean;
}
export default function ZoomImage({
  src,
  alt,
  style,
  lazy = true,
  legend,
  local = false,
}: props) {
  const { site, token } = useAuth();

  const fullUrl = local ? src : `${site.host}${site.apiPrefix}/${token}${src}`;

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
      <div className="zoom-image-placeholder" style={style}>
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

export function ZoomImageIcat({
  dataset,
  index,
  alt,
  style,
  lazy = true,
  legend,
}: {
  dataset: Dataset;
  index: number;
  alt?: string;
  style?: CSSProperties;
  lazy?: boolean;
  legend?: string;
}) {
  const { site, token } = useAuth();

  const [error, setError] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const [img, setImg] = useState<JSX.Element | undefined>(undefined);

  const imageId =
    getDatasetParam(dataset, 'ResourcesGallery')?.split(' ')[index] || '';

  const fullUrl = `${site.host}${site.apiPrefix}/resource/${token}${
    getIcatGalleryDownloadUrl(imageId).url
  }`;

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
      <div className="zoom-image-placeholder" style={style}>
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
