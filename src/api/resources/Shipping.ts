import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';
import { withShipping } from 'models/Shipping';

export class ShippingEntity extends Entity {
  readonly shippingId: number | undefined = undefined;

  pk() {
    return this.shippingId?.toString();
  }
}

export const ShippingResource = createPaginatedResource({
  path: '/shippings/:shippingId',
  schema: withShipping(ShippingEntity),
});
