import PaginatedResource from 'api/resources/Base/Paginated';
import { withShipping } from 'models/Shipping.d';

export class _ShippingResource extends PaginatedResource {
  readonly shippingId: number | undefined = undefined;

  pk() {
    return this.shippingId?.toString();
  }
  static urlRoot = 'shippings';
}

export const ShippingResource = withShipping(_ShippingResource);
