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
          to={`/legacy/proposals/${proposalName}/EM/${sessionId}/summary`}
        >
          Summary
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/EM/${sessionId}/statistics`}
        >
          Statistics
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/EM/${sessionId}/classification`}
        >
          2D Classification
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
