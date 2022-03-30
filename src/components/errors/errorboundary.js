import React from 'react';
import ErrorUserMessage from 'components/usermessages/errorusermessage';
import Page from 'pages/page';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: null, stack: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, message: error.message, stack: error.stack };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Page>
          <ErrorUserMessage title={'Something went wrong.'} message={this.state.message} stack={this.state.stack}></ErrorUserMessage>
        </Page>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
