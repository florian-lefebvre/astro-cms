/// <reference types="astro/client" />

declare module "virtual:astro-cms/internal" {
	export const options: import("./src/options.js").IntegrationOptions;
	export const astroConfig: Pick<import("astro").AstroConfig, "root">;
}

declare module "virtual:astro-cms/raw-config" {
	export const rawConfig: import("./src/config.js").Config;
}

declare namespace App {
	interface Locals {
		__cms: {
			resolvedConfig: import("./src/config.js").ResolvedConfig;
		};
	}
}
