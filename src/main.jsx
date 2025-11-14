import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Wait for DOM to be ready
const initializeApp = () => {
	const rootElement = document.getElementById("root");
	if (!rootElement) {
		console.error("Root element not found");
		return;
	}

	try {
		const root = ReactDOM.createRoot(rootElement);
		root.render(
			<ErrorBoundary>
				<React.StrictMode>
					<App />
				</React.StrictMode>
			</ErrorBoundary>,
		);
	} catch (error) {
		console.error("Failed to initialize React app:", error);
		rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: system-ui;">
        <h2>Application Error</h2>
        <p>Failed to load the application. Please try refreshing the page.</p>
        <button onclick="window.location.reload()">Refresh</button>
      </div>
    `;
	}
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initializeApp);
} else {
	initializeApp();
}
