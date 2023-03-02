import createPaginatedResource from './Base/Paginated';
import { ShippingBase } from 'models/Shipping';

export class ShippingEntity extends ShippingBase {
  readonly shippingId: number;

  pk() {
    return this.shippingId?.toString();
  }
}

export const ShippingResource = createPaginatedResource({
  path: '/shippings/:shippingId',
  schema: ShippingEntity,
});
