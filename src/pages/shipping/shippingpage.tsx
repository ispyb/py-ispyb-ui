import React from 'react';

import Page from 'pages/page';
import { useParams } from 'react-router-dom';
import { Card, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faBoxOpen, faFlask } from '@fortawesome/free-solid-svg-icons';
import { AddressesTab } from './addressestab';
import { ShipmentsTab } from './shipmentstab';
import { StockSolutionsTab } from './stocksolutionstab';

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
            <AddressesTab proposalName={proposalName}></AddressesTab>
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
            <ShipmentsTab proposalName={proposalName}></ShipmentsTab>
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
            <StockSolutionsTab proposalName={proposalName}></StockSolutionsTab>
          </Card>
        </Tab>
      </Tabs>
    </Page>
  );
}
