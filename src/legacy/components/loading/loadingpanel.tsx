import React, { PropsWithChildren } from 'react';
import { Card, Spinner } from 'react-bootstrap';

export type LoadingPanelType = PropsWithChildren<{
  text?: string;
}>;

export default function LoadingPanel({ children, text }: LoadingPanelType) {
  return (
    <div>
      <Card className="text-center">
        <Card.Body style={{ paddingTop: 200, paddingBottom: 200 }}>
          <Card.Text>
            <span>
              <Spinner animation="border" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
              {text ? text : 'Loading...'}
            </span>
            {children}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
