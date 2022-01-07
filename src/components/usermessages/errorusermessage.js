import React from 'react';
import { Alert } from 'react-bootstrap';

export default class ErrorUserMessage extends React.Component {
  render() {
    return (
      <Alert variant="danger" onDismiss={this.handleDismiss}>
        <p className="text-danger">{this.props.text}</p>
      </Alert>
    );
  }
}
