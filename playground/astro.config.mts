import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { createResolver } from "astro-integration-kit";
import { hmrIntegration } from "astro-integration-kit/dev";

const {default: cms} = await import("astro-cms")

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		cms(),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
	],
});
