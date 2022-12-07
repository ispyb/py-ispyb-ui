import { AuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { BraggyHeader } from 'components/Events/DataCollections/Braggy/models';
import { withImageHistogram } from 'models/ImageHistogram.d';

export class ImageHeaderResource extends AuthenticatedSingletonResource {
  readonly braggy_hdr: BraggyHeader;
  static urlRoot = 'data/images/header';
}

class _ImageHistogramResource extends AuthenticatedSingletonResource {
  static urlRoot = 'data/images/histogram';
}

export const ImageHistogramResource = withImageHistogram(
  _ImageHistogramResource
);
