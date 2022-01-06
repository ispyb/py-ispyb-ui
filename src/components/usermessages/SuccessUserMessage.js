import React from 'react';
import { Alert } from 'react-bootstrap';

class SuccessUserMessage extends React.Component {
  render() {
    return (
      <Alert bsStyle="success" onDismiss={this.handleDismiss}>
        <p className="text-success">{this.props.text}</p>
      </Alert>
    );
  }
}

export default SuccessUserMessage;
