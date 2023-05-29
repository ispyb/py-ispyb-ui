import { Container } from 'react-bootstrap';

export function Footer() {
  return (
    <div className="footer">
      <Container className="text-center">
        &copy; {new Date().getFullYear()} ESRF
      </Container>
    </div>
  );
}
