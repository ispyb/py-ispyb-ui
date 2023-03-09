import { useMXDataCollectionsBy } from 'legacy/hooks/ispyb';
import _ from 'lodash';

export function ShippingsInfo({
  sessionId,
  proposalName,
}: {
  sessionId: string;
  proposalName: string;
}) {
  const { data: dataCollectionGroups } = useMXDataCollectionsBy({
    proposalName,
    sessionId,
  });

  const shippings = _(dataCollectionGroups || [])
    .map((dcg) => dcg.Shipping_shippingId)
    .uniq()
    .value();
  return <div>Shippings info</div>;
}
