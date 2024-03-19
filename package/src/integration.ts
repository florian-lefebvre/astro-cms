import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro"

export const integration = (): AstroIntegration => {
	return {
		name: "astro-cms",
		hooks: {
			"astro:config:setup": ({ updateConfig, config }) => {
				let cmsConfig: any;

				updateConfig({
					vite: {
						plugins: [
							{
								name: "astro-cms-vite-plugin",
								async configureServer(viteServer) {
									const configPath = fileURLToPath(
										new URL("./cms.config.ts", config.root),
									);

									const mod = await viteServer.ssrLoadModule(configPath);
									cmsConfig = mod.default;
									console.log(cmsConfig);
								},
							},
						],
					},
				});
			}
		}
	}
}