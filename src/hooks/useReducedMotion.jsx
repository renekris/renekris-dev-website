import { useState, useEffect } from "react";

// Helper to check if we're in browser environment
const isBrowser = () => typeof window !== "undefined";

export function useReducedMotion() {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		// Only run in browser environment
		if (!isClient || !isBrowser()) return;

		try {
			const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
			setPrefersReducedMotion(mediaQuery.matches);

			const handleChange = (event) => {
				setPrefersReducedMotion(event.matches);
			};

			mediaQuery.addEventListener("change", handleChange);

			return () => {
				try {
					mediaQuery.removeEventListener("change", handleChange);
				} catch {
					// Silently fail on cleanup
				}
			};
		} catch (error) {
			// If matchMedia is not supported, assume no reduced motion preference
			console.warn("matchMedia not supported for reduced motion detection");
			setPrefersReducedMotion(false);
		}
	}, [isClient]);

	return prefersReducedMotion;
}
