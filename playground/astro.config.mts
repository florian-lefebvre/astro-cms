import { defineConfig } from "astro/config";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";
import node from "@astrojs/node";
const { default: cms } = await import("astro-cms");

// https://astro.build/config
export default defineConfig({
	integrations: [
		cms(),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
	],
	output: "hybrid",
	adapter: node({
		mode: "standalone",
	}),
});
