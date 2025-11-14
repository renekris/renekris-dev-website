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

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
