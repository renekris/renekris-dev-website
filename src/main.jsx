import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Debug logging
console.log("🔍 Debug: React app starting...");
console.log("🔍 Debug: Root element:", document.getElementById("root"));
console.log("🚀 Debug: App loaded successfully at:", new Date().toISOString());
console.log(
	"🔧 Fix deployed: Removed lazy loading to prevent modulepreload issue",
);

// Simple React mount
try {
	const rootElement = document.getElementById("root");
	console.log("🎯 Root element found:", !!rootElement);

	ReactDOM.createRoot(rootElement).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);

	console.log("✅ React mounted successfully");
} catch (error) {
	console.error("❌ React mount error:", error);
	const rootElement = document.getElementById("root");
	if (rootElement) {
		rootElement.style.backgroundColor = "red";
		rootElement.style.padding = "20px";
		rootElement.innerHTML = `<div style='color: white; font-size: 18px;'>❌ REACT ERROR: ${error.message}</div>`;
	}
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
