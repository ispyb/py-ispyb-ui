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
  showCenter?: boolean;
}

export default function ZoomImage(props: props) {
  const aspectRatio = props.aspectRatio || '3/2';
  const placeholder = (
    <div
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
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
  );
  return (
    <div
      style={{
        ...props.style,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: aspectRatio,
          position: 'relative',
          border: '3px solid #d4e4bc',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'black',
          color: 'white',
        }}
      >
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
      {props.legend ? <span>{props.legend}</span> : null}
    </div>
  );
}

const fetchBase64Data = (url: string) =>
  fetch(url)
    .then((response) => {
      if (response.status !== 200) throw new Error('Not found');
      return response.blob();
    })
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
  placeholder,
  local = false,
  showCenter,
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
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}
        className="text-center"
      >
        <span>{alt} not found</span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
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
      {showCenter && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '5%',
            aspectRatio: '1/1',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: 1,
              backgroundColor: 'red',
              transform: 'translate(-50%, 0%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              height: 1,
              backgroundColor: 'red',
              transform: 'translate(0%, -50%)',
            }}
          />
        </div>
      )}
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
