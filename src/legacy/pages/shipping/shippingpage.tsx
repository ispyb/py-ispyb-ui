import React, { Suspense } from 'react';

import { useParams } from 'react-router-dom';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { AddressesTab } from './addressestab';
import { ShipmentsTab } from './shipmentstab';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import LoadingPanel from 'legacy/components/loading/loadingpanel';

type Param = {
  proposalName: string;
};

export default function ShippingPage() {
  const { proposalName = '' } = useParams<Param>();

  return (
    <Tabs defaultActiveKey="addresses">
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
          <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <AddressesTab proposalName={proposalName}></AddressesTab>
            </Suspense>
          </LazyWrapper>
        </Card>
      </Tab>
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
          <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <ShipmentsTab proposalName={proposalName}></ShipmentsTab>
            </Suspense>
          </LazyWrapper>
        </Card>
      </Tab>
    </Tabs>
  );
}
