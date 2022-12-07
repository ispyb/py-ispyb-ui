import { useSuspense } from 'rest-hooks';

import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Table from 'components/Layout/Table';
import { ShippingResource } from 'api/resources/Shipping';
import { Shipping } from 'models/Shipping.d';
import { Truck } from 'react-bootstrap-icons';
import { usePath } from 'hooks/usePath';

export default function ShippingList() {
  const navigate = useNavigate();
  const proposal = usePath('proposal');
  const shippings = useSuspense(ShippingResource.list(), {
    ...(proposal ? { proposal } : {}),
  });

  const onRowClick = (row: Shipping) => {
    navigate(`/proposals/${proposal}/shipments/${row.shippingId}`);
  };

  return (
    <section>
      <h1 className="clearfix">
        Shipments
        <div className="float-end">
          <Button
            onClick={() => navigate(`/proposals/${proposal}/shipments/new`)}
          >
            <Truck className="me-1" /> New
          </Button>
        </div>
      </h1>

      <Table
        onRowClick={onRowClick}
        keyId="shippingId"
        paginator={{
          total: shippings.total,
          skip: shippings.skip,
          limit: shippings.limit,
        }}
        results={shippings.results}
        columns={[
          { label: 'Name', key: 'shippingName' },
          { label: 'Created', key: 'bltimeStamp' },
          { label: 'Safety Level', key: 'safetyLevel' },
          { label: '# Components', key: '_metadata.dewars' },
        ]}
        emptyText="No shipments yet"
      />
    </section>
  );
}
