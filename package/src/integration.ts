import { fileURLToPath } from "node:url";
import {
	addIntegration,
	addVitePlugin,
	createResolver,
	defineIntegration,
	withPlugins,
} from "astro-integration-kit";
import { z } from "astro/zod";
import { resolveConfig, type ResolvedConfig } from "./config.js";
import tailwind from "@astrojs/tailwind";
import inoxToolsPlugin from "@inox-tools/aik-mod";

export const integration = defineIntegration({
	optionsSchema: z
		.object({
			configFile: z.string().default("./cms.config.ts"),
			base: z.string().default("/cms"),
		})
		.default({}),
	name: "astro-cms",
	setup({ options, name }) {
		const { resolve } = createResolver(import.meta.url);

		let resolvedConfig: ResolvedConfig;

		return withPlugins({
			name,
			plugins: [inoxToolsPlugin],
			hooks: {
				"astro:config:setup": ({ defineModule, ...params }) => {
					const { config, injectRoute, logger } = params;

					if (config.output === "static") {
						logger.error("`output: 'static'` is not supported.");
						throw new Error("astro-cms failed.");
					}

					addVitePlugin(params, {
						plugin: {
							name: "astro-cms-vite-plugin",
							async configureServer(viteServer) {
								const configPath = fileURLToPath(
									new URL(options.configFile, config.root),
								);

								const mod = await viteServer.ssrLoadModule(configPath);
								resolvedConfig = resolveConfig(mod.default);
								console.dir(resolvedConfig, { depth: null });
							},
						},
					});

					defineModule("virtual:astro-cms/resolved-config", {
						constExports: {
							resolvedConfig,
							foo: "bar",
						},
					});

					addIntegration(params, {
						integration: tailwind({
							applyBaseStyles: false,
							configFile: resolve("../assets/tailwind.config.mjs"),
						}),
					});

					const getRouteOptions = (pattern: string) => ({
						pattern: `${options.base}${pattern}`,
						prerender: false,
					});

					injectRoute({
						entrypoint: resolve("../assets/pages/index.astro"),
						...getRouteOptions("/"),
					});
					injectRoute({
						entrypoint: resolve("../assets/pages/[collection]/index.astro"),
						...getRouteOptions("/[collection]"),
					});
					injectRoute({
						entrypoint: resolve("../assets/pages/[collection]/[id].astro"),
						...getRouteOptions("/[collection]/[id]"),
					});
					injectRoute({
						entrypoint: resolve("../assets/pages/__api/[collection]/index.ts"),
						...getRouteOptions("/__api/[collection]"),
					});
					injectRoute({
						entrypoint: resolve("../assets/pages/__api/[collection]/[id].ts"),
						...getRouteOptions("/__api/[collection]/[id]"),
					});
				},
			},
		});
	},
});
