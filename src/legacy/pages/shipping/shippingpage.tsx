import { useParams } from 'react-router-dom';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { AddressesTab } from './addressestab';
import { ShipmentsTab } from './shipmentstab';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import Loading from 'components/Loading';

type Param = {
  proposalName: string;
};

export default function ShippingPage() {
  const { proposalName = '' } = useParams<Param>();

  return (
    <Tabs defaultActiveKey="shipments">
      <Tab
        eventKey="shipments"
        title={
          <>
            <FontAwesomeIcon
              style={{ marginRight: 10 }}
              size="lg"
              icon={faBoxOpen}
            ></FontAwesomeIcon>
            Shipments
          </>
        }
      >
        <Card>
          <LazyWrapper placeholder={<Loading />}>
            <ShipmentsTab proposalName={proposalName}></ShipmentsTab>
          </LazyWrapper>
        </Card>
      </Tab>
      <Tab
        eventKey="addresses"
        title={
          <>
            <FontAwesomeIcon
              style={{ marginRight: 10 }}
              size="lg"
              icon={faAddressCard}
            ></FontAwesomeIcon>
            Shipping addresses
          </>
        }
      >
        <Card>
          <LazyWrapper placeholder={<Loading />}>
            <AddressesTab proposalName={proposalName}></AddressesTab>
          </LazyWrapper>
        </Card>
      </Tab>
    </Tabs>
  );
}
