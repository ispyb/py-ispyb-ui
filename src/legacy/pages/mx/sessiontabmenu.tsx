import NbBadge from 'legacy/components/nbBadge';
import {
  useMXDataCollectionsBy,
  useMXEnergyScans,
  useMXFluorescenceSpectras,
} from 'legacy/hooks/ispyb';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function SessionTabMenu({
  proposalName = '',
  sessionId = '',
}: {
  proposalName: string | undefined;
  sessionId: string | undefined;
}) {
  const { data: dataCollectionGroups } = useMXDataCollectionsBy({
    proposalName,
    sessionId,
  });
  // const { data: spectras } = useMXFluorescenceSpectras({
  //   proposalName,
  //   sessionId,
  // });
  // const { data: energyScans } = useMXEnergyScans({
  //   proposalName,
  //   sessionId,
  // });

  return (
    <Nav variant="tabs">
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/MX/${sessionId}/summary`}
        >
          Data Collections <NbBadge value={dataCollectionGroups?.length} />
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/MX/${sessionId}/energy`}
        >
          {/* Energy Scans <NbBadge value={energyScans?.length} /> */}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/legacy/proposals/${proposalName}/MX/${sessionId}/xrf`}
        >
          {/* Fluorescence Spectra <NbBadge value={spectras?.length} /> */}
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
