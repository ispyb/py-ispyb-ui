import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function SessionTabMenu({
  proposalName,
  sessionId,
}: {
  proposalName: string | undefined;
  sessionId: string | undefined;
}) {
  return (
    <Nav variant="tabs">
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/MX/${sessionId}/summary`}
        >
          Data Collections
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/MX/${sessionId}/energy`}
        >
          Energy Scans
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/MX/${sessionId}/xrf`}
        >
          Flourescence Spectra
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
