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

// Add visible debugging
const rootElement = document.getElementById("root");
if (rootElement) {
	rootElement.style.backgroundColor = "red";
	rootElement.style.padding = "20px";
	rootElement.innerHTML =
		"<div style='color: white; font-size: 24px;'>🔧 REACT LOADING DEBUG - If you see this, JS is working but React may have an issue</div>";

	setTimeout(() => {
		ReactDOM.createRoot(rootElement).render(
			<React.StrictMode>
				<App />
			</React.StrictMode>,
		);
	}, 2000);
} else {
	console.error("❌ Root element not found!");
}

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
