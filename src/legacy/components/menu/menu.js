import { Navbar, Container } from 'react-bootstrap';
export default function Menu(props) {
  return (
    <Navbar expand="lg">
      <Container fluid>{props.children}</Container>
    </Navbar>
  );
}
