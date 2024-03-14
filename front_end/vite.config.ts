import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { splitVendorChunkPlugin } from "vite";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), splitVendorChunkPlugin()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: "dist",
		sourcemap: true,
		emptyOutDir: true,
		rollupOptions: {
			output: {
				entryFileNames: "assets/[name].js",
				chunkFileNames: "assets/[name].js",
				assetFileNames: "[name].[ext]",
				manualChunks: (id) => {
					if (id.includes("node_modules"))
						return id
							.toString()
							.split("node_modules/")[1]
							.split("/")[0]
							.toString();
				},
			},
		},
	},
});
