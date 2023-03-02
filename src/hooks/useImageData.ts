import { useSuspense } from 'rest-hooks';
import { getXHRArrayBuffer } from 'api/resources/XHRFile';
import {
  ImageHeaderEndpoint,
  ImageHistogramEndpoint,
} from 'api/resources/ImageHeader';
import { useAuth } from './useAuth';

interface IImageData {
  imageNumber: number;
  dataCollectionId?: string;
  progress?: (progress: number) => void;
  loadData?: boolean;
}

export function useImageData(props: IImageData) {
  const { imageNumber, dataCollectionId, progress, loadData } = props;
  const { site } = useAuth();
  const imageData = useSuspense(
    getXHRArrayBuffer,
    dataCollectionId && loadData
      ? {
          src: `${site.host}${site.apiPrefix}/data/images?dataCollectionId=${dataCollectionId}&imageNumber=${imageNumber}`,
          ...(progress ? { progress } : null),
        }
      : null
  );

  const imageHeader = useSuspense(ImageHeaderEndpoint, {
    ...(dataCollectionId ? { dataCollectionId } : null),
    imageNumber,
  });

  const imageHistogram = useSuspense(ImageHistogramEndpoint, {
    ...(dataCollectionId ? { dataCollectionId } : null),
    imageNumber,
  });

  return {
    imageData,
    imageHeader,
    imageHistogram,
  };
}
