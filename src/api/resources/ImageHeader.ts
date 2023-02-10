import { Entity } from '@rest-hooks/rest';
import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { BraggyHeader } from 'components/Events/DataCollections/Braggy/models';
import { ImageHistogramBase } from 'models/ImageHistogram';

class ImageHeaderEntity extends Entity {
  readonly braggy_hdr: BraggyHeader;
  readonly key: string;

  pk() {
    return this.key;
  }
}

export const ImageHeaderEndpoint = new AuthenticatedEndpoint({
  path: '/data/images/header',
  schema: ImageHeaderEntity,
  process(value, params) {
    value.key = `${params.dataCollectionId}:${params.imageNumber}`;
    return value;
  },
  searchParams: {} as {
    imageNumber: number;
    dataCollectionId?: string;
  },
});

class ImageHistogramEntity extends ImageHistogramBase {
  readonly key: string;

  pk() {
    return this.key;
  }
}

export const ImageHistogramEndpoint = new AuthenticatedEndpoint({
  path: '/data/images/histogram',
  schema: ImageHistogramEntity,
  process(value, params) {
    value.key = `${params.dataCollectionId}:${params.imageNumber}`;
    return value;
  },
  searchParams: {} as {
    imageNumber: number;
    dataCollectionId?: string;
  },
});
