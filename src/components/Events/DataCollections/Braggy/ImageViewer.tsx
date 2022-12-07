import type { Domain } from '@h5web/lib';
import { Suspense, useState, useMemo, useContext } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

import { ScaleType, useSafeDomain, useVisDomain } from '@h5web/lib';
import { usePath } from 'hooks/usePath';
import { useImageData } from 'hooks/useImageData';
import { ErrorBoundary, Loading } from 'api/resources/XHRFile';
import ImageView, { Props } from './ImageView';
import { ConfigProvider, ConfigContext, IConfigContext } from './configContext';
import ImageToolbar from './toolbar/ImageToolbar';
import type { BraggyHeader, Histogram } from './models';
import { useSuspense } from 'rest-hooks';
import { EventResource } from 'api/resources/Event';
import { DataCollection } from 'models/Event';
import { CaretLeft, CaretRight } from 'react-bootstrap-icons';

interface IImageViewWrapped extends Omit<Props, 'progress'> {}

function ImageViewWrapped(props: IImageViewWrapped) {
  const [progress, setProgress] = useState<number>(0);
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading progress={progress} />}>
        <ImageView
          {...props}
          progress={(progress: number) => setProgress(progress)}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

// http://localhost:3001/proposals/MX2112/sessions/63593/images/2314164
function ImageViewerMain() {
  const dataCollectionId = usePath('dataCollectionId');

  const [imageNumber, setImageNumber] = useState<number>(1);

  const dataCollections = useSuspense(EventResource.list(), {
    dataCollectionId,
  });
  const dataCollection =
    dataCollections && (dataCollections.results[0].Item as DataCollection);

  const { imageHistogram, imageHeader } = useImageData({
    imageNumber,
    dataCollectionId,
    loadData: false,
  });

  const { scaleType, customDomain } = useContext(
    ConfigContext
  ) as IConfigContext;

  const { strict_positive_min, positive_min, min, std } =
    imageHeader.braggy_hdr as BraggyHeader;

  const domain = useMemo<Domain>(() => {
    if (scaleType === ScaleType.Log) {
      return [strict_positive_min, std];
    }

    if (scaleType === ScaleType.Sqrt) {
      return [positive_min, std];
    }

    return [min, std];
  }, [min, positive_min, scaleType, std, strict_positive_min]);

  const visDomain = useVisDomain(customDomain, domain);
  const [safeDomain] = useSafeDomain(visDomain, domain, scaleType);

  return (
    <section>
      <div>
        <div className="d-flex">
          <div className="d-flex">
            <InputGroup>
              <Button size="sm" onClick={() => setImageNumber(imageNumber - 1)}>
                <CaretLeft />
              </Button>

              <Form.Control
                size="sm"
                type="text"
                style={{ width: 'auto' }}
                defaultValue={imageNumber}
              />
              <InputGroup.Text>
                / {dataCollection && dataCollection.numberOfImages}
              </InputGroup.Text>

              <Button size="sm" onClick={() => setImageNumber(imageNumber + 1)}>
                <CaretRight />
              </Button>
            </InputGroup>
          </div>

          <ImageToolbar
            dataDomain={domain}
            histogram={imageHistogram as Histogram}
          />
        </div>
        <ImageViewWrapped
          dataCollectionId={dataCollectionId}
          imageNumber={imageNumber}
          safeDomain={safeDomain}
        />
      </div>
    </section>
  );
}

export default function ImageViewer() {
  return (
    <ConfigProvider>
      <Suspense>
        <ImageViewerMain />
      </Suspense>
    </ConfigProvider>
  );
}
