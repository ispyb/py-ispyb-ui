import { Spinner, Container } from 'react-bootstrap';

export default function Loading() {
  return (
    <section className="loading">
      <Container className="text-center">
        <div className="m-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="text-primary">Loading ...</div>
        </div>
      </Container>
    </section>
  );
}
