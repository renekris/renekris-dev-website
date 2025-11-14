import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
	js.configs.recommended,
	prettier,
	{
		plugins: {
			react: react,
			prettier: prettierPlugin,
		},
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				// Browser globals
				...globals.browser,
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
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			// React rules
			...react.configs.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			// Prettier rules
			...prettier.rules,
			// Custom rules
			"no-unused-vars": "off", // Allow unused imports for now
			"no-console": "off", // Allow console logs for debugging
			"react/prop-types": "off", // Disable prop-types requirement for modern React
			"react/react-in-jsx-scope": "off", // Not needed with React 17+ JSX transform
			"prettier/prettier": "error", // Show Prettier errors as ESLint errors
		},
	},
	{
		// Configuration for Node.js files (server files)
		files: ["src/server/**/*.js", "src/server/**/*.jsx", "src/setupTests.js"],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	{
		// Configuration for test files
		files: ["**/*.test.{js,jsx}", "**/*.spec.{js,jsx}", "src/setupTests.js"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
				global: "writable",
				TextEncoder: "readonly",
				TextDecoder: "readonly",
				Request: "readonly",
				Response: "readonly",
				fetch: "readonly",
				URLSearchParams: "readonly",
				DocumentFragment: "readonly",
			},
		},
	},
	{
		ignores: ["build/**", "dist/**", "node_modules/**", "coverage/**"],
	},
];
