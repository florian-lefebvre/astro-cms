import { fileURLToPath } from "node:url";
import {
	addIntegration,
	addVirtualImports,
	addVitePlugin,
	createResolver,
	defineIntegration,
	withPlugins,
} from "astro-integration-kit";
import { resolveConfig, type ResolvedConfig } from "./config.js";
import tailwind from "@astrojs/tailwind";
import inoxToolsPlugin from "@inox-tools/aik-mod";
import { optionsSchema } from "./options.js";

export const integration = defineIntegration({
	optionsSchema,
	name: "astro-cms",
	setup({ options, name }) {
		const { resolve } = createResolver(import.meta.url);

		let resolvedConfig: ResolvedConfig;

		return withPlugins({
			name,
			plugins: [inoxToolsPlugin],
			hooks: {
				"astro:config:setup": ({ defineModule, ...params }) => {
					const { config, injectRoute, logger, addMiddleware } = params;

					if (config.output === "static") {
						logger.error("`output: 'static'` is not supported.");
						throw new Error("astro-cms failed.");
					}

					const configPath = fileURLToPath(
						new URL(options.configFile, config.root),
					);

					addVitePlugin(params, {
						plugin: {
							name: "astro-cms-vite-plugin",
							async configureServer(viteServer) {
								const mod = await viteServer.ssrLoadModule(configPath);
								resolvedConfig = resolveConfig(mod.default);
								// console.dir(resolvedConfig, { depth: null });
							},
						},
					});

					addVirtualImports(params, {
						name,
						imports: {
							"virtual:astro-cms/raw-config": `import * as mod from ${JSON.stringify(
								configPath,
							)};
							
							export const rawConfig = mod.default;
							`,
						},
					});

					defineModule("virtual:astro-cms/internal", {
						constExports: {
							options,
							astroConfig: {
								root: config.root,
							},
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

					addMiddleware({
						entrypoint: resolve("../assets/middleware.ts"),
						order: "pre",
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
