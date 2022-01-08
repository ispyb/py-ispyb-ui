import React from 'react';
import ErrorUserMessage from 'components/usermessages/errorusermessage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: null, stack: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, message: error.message, stack: error.stack };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorUserMessage title={'Something went wrong.'} message={this.state.message} stack={this.state.stack}></ErrorUserMessage>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
