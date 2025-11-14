import React from "react";
import { ThemeProvider } from "./contexts";
import "./index.css";

// Import portfolio components
import SmoothScrollNavigation from "./components/SmoothScrollNavigation";
import Hero from "./components/sections/Hero";
import Contact from "./components/sections/Contact";
import ScrollProgressIndicator from "./components/ScrollProgressIndicator";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
	return (
		<ErrorBoundary>
			<ThemeProvider>
				<div className="min-h-screen theme-transition">
					{/* Navigation */}
					<SmoothScrollNavigation />

					{/* Scroll Progress Indicator */}
					<ScrollProgressIndicator />

					{/* Main Content */}
					<main>
						{/* Hero Section */}
						<Hero />

						{/* Contact Section */}
						<Contact />
					</main>
				</div>
			</ThemeProvider>
		</ErrorBoundary>
	);
}

export default App;
