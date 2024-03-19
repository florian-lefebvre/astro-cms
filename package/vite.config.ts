import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { name as PKG_NAME } from "./package.json";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const _resolve = (path: string) =>
	resolve(dirname(fileURLToPath(import.meta.url)), path);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [dts()],
	build: {
		lib: {
			name: PKG_NAME,
			entry: [_resolve("src/index.ts"), _resolve("src/config.ts")],
		},
		rollupOptions: {
			external: ["node:url"],
		},
	},
});
