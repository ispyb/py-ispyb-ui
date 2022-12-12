import React, { useState } from 'react';
import { Alert, Container } from 'react-bootstrap';

export default function ErrorUserMessage(props) {
  const [show, setShow] = useState(true);
  const { title, message, stack } = props;
  if (show) {
    return (
      <Container style={{ margin: 10 }}>
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>{title}</Alert.Heading>
          <p>{message}</p>
          {stack && (
            <>
              <hr />
              <pre>{stack}</pre>
            </>
          )}
        </Alert>
      </Container>
    );
  }

  return null;
}
