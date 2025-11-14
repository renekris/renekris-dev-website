import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// Catch errors in any components below and re-render with error message
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});

		// Log error to console in development
		if (process.env.NODE_ENV === "development") {
			console.error("ErrorBoundary caught an error:", error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div
					style={{
						padding: "20px",
						textAlign: "center",
						fontFamily: "system-ui, -apple-system, sans-serif",
						color: "#333",
						minHeight: "100vh",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<h2>Something went wrong</h2>
					<p>The website encountered an error while loading.</p>
					<details
						style={{
							marginTop: "20px",
							textAlign: "left",
							whiteSpace: "pre-wrap",
							backgroundColor: "#f5f5f5",
							padding: "15px",
							borderRadius: "5px",
							border: "1px solid #ddd",
							maxWidth: "600px",
						}}
					>
						<summary>Error details</summary>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo.componentStack}
					</details>
					<button
						onClick={() => window.location.reload()}
						style={{
							marginTop: "20px",
							padding: "10px 20px",
							backgroundColor: "#3b82f6",
							color: "white",
							border: "none",
							borderRadius: "5px",
							cursor: "pointer",
						}}
					>
						Reload Page
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
