import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function SessionTabMenu({ proposalName, sessionId }: { proposalName: string | undefined; sessionId: string | undefined }) {
  return (
    <Nav variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <LinkContainer to={`/${proposalName}/MX/${sessionId}`}>
          <Nav.Link>Data Collections</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to={`/${proposalName}/MX/${sessionId}/energy`}>
          <Nav.Link>Energy Scans</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to={`/${proposalName}/MX/${sessionId}/xrf`}>
          <Nav.Link>Flourescence Spectra</Nav.Link>
        </LinkContainer>
      </Nav.Item>
    </Nav>
  );
}
