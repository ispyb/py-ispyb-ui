import {
  createSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { BraggyHeader } from 'components/Events/DataCollections/Braggy/models';
import { withImageHistogram } from 'models/ImageHistogram';

class ImageHeaderEntity extends SingletonEntity {
  readonly braggy_hdr: BraggyHeader;
  static urlRoot = 'data/images/header';
}

export const ImageHeaderResource = createSingletonResource({
  path: '/data/images/header/:dummy',
  schema: ImageHeaderEntity,
});

export const ImageHistogramResource = createSingletonResource({
  path: '/data/images/histogram/:dummy',
  schema: withImageHistogram(SingletonEntity),
});
