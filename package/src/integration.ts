import { fileURLToPath } from "node:url";
import { addVitePlugin, createResolver, defineIntegration } from "astro-integration-kit";
import { z } from "astro/zod";
import { resolveConfig, type ResolvedConfig } from "./config.js";

export const integration = defineIntegration({
	optionsSchema: z
		.object({
			configFile: z.string().default("./cms.config.ts"),
			base: z.string().default("/cms")
		})
		.default({}),
	name: "astro-cms",
	setup({ options }) {
		const { resolve } = createResolver(import.meta.url)

		let resolvedConfig: ResolvedConfig

		return {
			hooks: {
				"astro:config:setup": (params) => {
					const { config, injectRoute, logger } = params

					if (config.output === "static") {
						logger.error("`output: 'static'` is not supported.")
						throw new Error("astro-cms failed.")
					}

					addVitePlugin(params, {
						plugin: {
							name: "astro-cms-vite-plugin",
							async configureServer(viteServer) {
								const configPath = fileURLToPath(
									new URL(options.configFile, config.root),
								);

								const mod = await viteServer.ssrLoadModule(configPath);
								resolvedConfig = resolveConfig(mod.default)
								console.dir(resolvedConfig, { depth: null });
							},
						},
					});

					injectRoute({
						entrypoint: resolve("../assets/routes/index.astro"),
						pattern: `${options.base}/`,
						prerender: false
					})
				},
			},
		};
	},
});
