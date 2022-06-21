import React from 'react';

import Page from 'pages/page';
import { useParams } from 'react-router-dom';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faBoxOpen, faFlask } from '@fortawesome/free-solid-svg-icons';
import { AddressesTab } from './addressestab';
import { ShipmentsTab } from './shipmentstab';
import { StockSolutionsTab } from './stocksolutionstab';
import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';

type Param = {
  proposalName: string;
};

export default function ShippingPage() {
  const { proposalName = '' } = useParams<Param>();

  return (
    <Page selected="shipping">
      <Tabs defaultActiveKey="addresses">
        <Tab
          eventKey="addresses"
          title={
            <>
              <FontAwesomeIcon style={{ marginRight: 10 }} size="lg" icon={faAddressCard}></FontAwesomeIcon>Shipping addresses
            </>
          }
        >
          <Card>
            <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
              <AddressesTab proposalName={proposalName}></AddressesTab>
            </LazyWrapper>
          </Card>
        </Tab>
        <Tab
          eventKey="shipments"
          title={
            <>
              <FontAwesomeIcon style={{ marginRight: 10 }} size="lg" icon={faBoxOpen}></FontAwesomeIcon>Shipments
            </>
          }
        >
          <Card>
            <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
              <ShipmentsTab proposalName={proposalName}></ShipmentsTab>
            </LazyWrapper>
          </Card>
        </Tab>
        <Tab
          eventKey="stock"
          title={
            <>
              <FontAwesomeIcon style={{ marginRight: 10 }} size="lg" icon={faFlask}></FontAwesomeIcon>Stock solutions
            </>
          }
        >
          <Card>
            <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
              <StockSolutionsTab proposalName={proposalName}></StockSolutionsTab>
            </LazyWrapper>
          </Card>
        </Tab>
      </Tabs>
    </Page>
  );
}
