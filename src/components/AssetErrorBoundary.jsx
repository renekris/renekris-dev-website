import React from "react";

class AssetErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, errorType: null };
	}

	static getDerivedStateFromError(error) {
		// Determine error type based on error message
		const errorType =
			error.message?.includes("Failed to load") ||
			error.message?.includes("Network error") ||
			error.message?.includes("404")
				? "asset"
				: "general";

		return { hasError: true, errorType };
	}

	componentDidCatch(error, errorInfo) {
		// Log error in development only
		if (process.env.NODE_ENV === "development") {
			// eslint-disable-next-line no-console
			console.error("AssetErrorBoundary caught an error:", error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			// Asset-specific fallback UI
			if (this.state.errorType === "asset") {
				return (
					<div
						style={{
							padding: "16px",
							textAlign: "center",
							backgroundColor: "var(--bg-secondary)",
							border: "1px solid var(--border-primary)",
							borderRadius: "8px",
							margin: "16px 0",
						}}
					>
						<p
							style={{
								color: "var(--text-secondary)",
								margin: "0",
								fontSize: "14px",
							}}
						>
							{this.props.fallbackMessage ||
								"Asset failed to load. Please try again later."}
						</p>
						{this.props.showRetry && (
							<button
								onClick={() =>
									this.setState({ hasError: false, errorType: null })
								}
								style={{
									marginTop: "8px",
									padding: "6px 12px",
									backgroundColor: "var(--primary)",
									color: "white",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
									fontSize: "12px",
								}}
							>
								Retry
							</button>
						)}
					</div>
				);
			}

			// General error fallback
			return (
				<div
					style={{
						padding: "20px",
						textAlign: "center",
						color: "var(--text-secondary)",
						backgroundColor: "var(--bg-secondary)",
						border: "1px solid var(--border-primary)",
						borderRadius: "8px",
						margin: "16px 0",
					}}
				>
					<p>Something went wrong while loading this content.</p>
				</div>
			);
		}

		return this.props.children;
	}
}

export default AssetErrorBoundary;
