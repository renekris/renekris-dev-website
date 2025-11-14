import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("dark");
	const [isLoaded, setIsLoaded] = useState(false);

	// Initialize theme from localStorage, defaulting to dark
	useEffect(() => {
		const initializeTheme = () => {
			try {
				const savedTheme =
					typeof window !== "undefined" && window.localStorage
						? localStorage.getItem("theme")
						: null;
				const initialTheme = savedTheme || "dark";
				setTheme(initialTheme);
				updateDocumentTheme(initialTheme);
				if (typeof document !== "undefined") {
					document.body.classList.add("theme-loaded");
				}
				setIsLoaded(true);
			} catch (error) {
				console.warn("Theme initialization failed:", error);
				const fallbackTheme = "dark";
				setTheme(fallbackTheme);
				updateDocumentTheme(fallbackTheme);
				if (typeof document !== "undefined") {
					document.body.classList.add("theme-loaded");
				}
				setIsLoaded(true);
			}
		};

		initializeTheme();
	}, []);

	// Listen for system theme changes
	useEffect(() => {
		if (typeof window === "undefined") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleSystemThemeChange = (e) => {
			try {
				// Only update if user hasn't set a manual preference
				if (!localStorage.getItem("theme")) {
					const newTheme = e.matches ? "dark" : "light";
					setTheme(newTheme);
					updateDocumentTheme(newTheme);
				}
			} catch (error) {
				console.warn("System theme change handler failed:", error);
			}
		};

		mediaQuery.addEventListener("change", handleSystemThemeChange);
		return () =>
			mediaQuery.removeEventListener("change", handleSystemThemeChange);
	}, []);

	const updateDocumentTheme = (newTheme) => {
		const root = document.documentElement;

		if (newTheme === "dark") {
			root.classList.add("dark");
			root.setAttribute("data-theme", "dark");
		} else {
			root.classList.remove("dark");
			root.setAttribute("data-theme", "light");
		}
	};

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		updateDocumentTheme(newTheme);
		try {
			if (typeof window !== "undefined" && window.localStorage) {
				localStorage.setItem("theme", newTheme);
			}
		} catch (error) {
			console.warn("Failed to save theme preference:", error);
		}
	};

	const setSpecificTheme = (newTheme) => {
		if (newTheme !== "light" && newTheme !== "dark") {
			throw new Error('Theme must be either "light" or "dark"');
		}

		setTheme(newTheme);
		updateDocumentTheme(newTheme);
		try {
			if (typeof window !== "undefined" && window.localStorage) {
				localStorage.setItem("theme", newTheme);
			}
		} catch (error) {
			console.warn("Failed to save theme preference:", error);
		}
	};

	const value = {
		theme,
		toggleTheme,
		setTheme: setSpecificTheme,
		isDark: theme === "dark",
		isLight: theme === "light",
		isLoaded,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};
