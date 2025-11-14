import js from "@eslint/js";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				console: "readonly",
				process: "readonly",
				window: "readonly",
				document: "readonly",
				navigator: "readonly",
				localStorage: "readonly",
				IntersectionObserver: "readonly",
				requestAnimationFrame: "readonly",
				MutationObserver: "readonly",
				URL: "readonly",
				Element: "readonly",
				HTMLElement: "readonly",
				EventTarget: "readonly",
				cancelAnimationFrame: "readonly",
				AbortController: "readonly",
				PointerEvent: "readonly",
				performance: "readonly",
				queueMicrotask: "readonly",
				getComputedStyle: "readonly",
				MessageChannel: "readonly",
			},
		},
		rules: {
			// Add your custom rules here
			"no-unused-vars": "warn",
			"no-console": "off", // Allow console logs for debugging
		},
		ignores: ["build/**", "dist/**", "node_modules/**"],
	},
];
