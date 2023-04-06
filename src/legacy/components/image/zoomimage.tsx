import { Spinner } from 'react-bootstrap';
import { CSSProperties, useEffect, useState } from 'react';
import LazyWrapper from '../loading/lazywrapper';
import { useAuth } from 'hooks/useAuth';

interface props {
  src: string;
  alt: string;
  style?: CSSProperties;
  legend?: string;
  aspectRatio?: string;
  local?: boolean;
}

export default function ZoomImage(props: props) {
  const aspectRatio = props.aspectRatio || '3/2';
  const placeholder = (
    <>
      <div
        style={{
          ...props.style,
          width: '100%',
          aspectRatio: aspectRatio,
          position: 'relative',
          border: '1px solid black',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner
          style={{ marginRight: 5 }}
          size="sm"
          animation="border"
          role="status"
          variant="dark"
        ></Spinner>
        <i>Loading...</i>
      </div>
      {props.legend && <span>{props.legend}</span>}
    </>
  );
  return (
    <div style={props.style}>
      <LazyWrapper
        threshold={100}
        aspectRatio={aspectRatio}
        placeholder={placeholder}
      >
        <Zoomable>
          <LoadImage {...props} placeholder={placeholder} />
        </Zoomable>
      </LazyWrapper>
    </div>
  );
}

const fetchBase64Data = (url: string) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise<string | undefined>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve(reader.result?.toString() || undefined);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    )
    .catch(() => undefined);

function LoadImage({
  src,
  alt,
  legend,
  placeholder,
  local = false,
}: props & { placeholder: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  const [data, setData] = useState<string | undefined>(undefined);
  const { site, token } = useAuth();
  const fullUrl = local ? src : `${site.host}${site.apiPrefix}/${token}${src}`;

  useEffect(() => {
    setLoaded(false);
    fetchBase64Data(fullUrl)
      .then((data) => {
        if (data) {
          setData(data);
        }
      })
      .catch(() => {
        setData(undefined);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, [fullUrl, alt]);

  if (!loaded) {
    return <>{placeholder}</>;
  }
  if (!data || data === 'data:' || data === 'data:;base64,') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span>{alt} not found</span>
        {legend && <span>{legend}</span>}
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        color: 'white',
      }}
    >
      <img
        alt={alt}
        style={{
          objectFit: 'contain',
          overflow: 'auto',
          width: '100%',
          height: '100%',
        }}
        src={data}
      />
      {legend && <span>{legend}</span>}
    </div>
  );
}

function Zoomable({ children }: { children: React.ReactNode }) {
  const [zoom, setZoom] = useState(false);

  return (
    <div
      style={{
        cursor: 'zoom-in',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '5px',
      }}
      onClick={() => setZoom(!zoom)}
    >
      {zoom && (
        <div
          style={{
            cursor: 'zoom-out',
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 1000000,
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setZoom(!zoom)}
        >
          {children}
        </div>
      )}
      {children}
    </div>
  );
}
