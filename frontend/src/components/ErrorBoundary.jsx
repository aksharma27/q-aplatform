import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log errorInfo to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: "#e53e3e", padding: "2rem" }}><h2>Something went wrong.</h2><pre>{this.state.error && this.state.error.toString()}</pre></div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
export { ErrorBoundary };
