import { useAuth } from 'hooks/useAuth';
import { JavaProposalMenu } from 'legacy/components/Header';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ProposalMenu } from './Header';

export function ActiveProposal() {
  const params = useParams<{
    proposalName?: string;
    proposal?: string;
  }>();

  const proposal = params.proposalName || params.proposal;

  const { isAuthenticated, site } = useAuth();

  if (!proposal || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" className="proposalnav">
        <Container>
          <div style={{ display: 'flex' }}>
            <span className="proposalname">{proposal}</span>
            <div
              style={{
                borderLeft: '1px solid white',
                alignSelf: 'stretch',
              }}
            />
            <Nav>
              {site.javaMode && <JavaProposalMenu proposal={proposal} />}
              {!site.javaMode && <ProposalMenu proposal={proposal} />}
            </Nav>
          </div>
        </Container>
      </Navbar>
    </>
  );
}
