import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import cms from "astro-cms";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), cms()],
});
