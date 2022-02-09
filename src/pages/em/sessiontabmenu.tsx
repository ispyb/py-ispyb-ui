import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function SessionTabMenu({ proposalName, sessionId }: { proposalName: string | undefined; sessionId: string | undefined }) {
  return (
    <Nav variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <LinkContainer to={`/${proposalName}/EM/${sessionId}`}>
          <Nav.Link>Summary</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to={`/${proposalName}/EM/${sessionId}/statistics`}>
          <Nav.Link>Statistics</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to={`/${proposalName}/EM/${sessionId}/classification`}>
          <Nav.Link>2D Classification</Nav.Link>
        </LinkContainer>
      </Nav.Item>
    </Nav>
  );
}
