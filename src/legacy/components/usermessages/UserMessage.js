import React from 'react';
import { Alert } from 'react-bootstrap';

export class ErrorUserMessage extends React.Component {
  render() {
    return (
      <Alert variant="danger" onDismiss={this.handleDismiss}>
        <h4>Oh snap! You got an error!</h4>
        <p className="text-danger">{this.props.text}</p>
      </Alert>
    );
  }
}

export class SuccessUserMessage extends React.Component {
  render() {
    return (
      <Alert variant="success" onDismiss={this.handleDismiss}>
        <p className="text-success">{this.props.text}</p>
      </Alert>
    );
  }
}
