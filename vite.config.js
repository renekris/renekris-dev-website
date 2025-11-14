import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: "build",
		sourcemap: true,
		copyPublicDir: true, // Ensure public directory is copied
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
					motion: ["framer-motion"],
				},
			},
		},
	},
	base: "/", // Use absolute paths for dev server
	server: {
		port: 5173,
		host: true,
	},
	preview: {
		port: 4173,
		host: true,
	},
	define: {
		"process.env.NODE_ENV": JSON.stringify(
			process.env.NODE_ENV || "development",
		),
		// Ensure VITE_ prefixed variables are available
		"process.env.REACT_APP_API_URL": JSON.stringify(
			process.env.REACT_APP_API_URL || "",
		),
	},
});
