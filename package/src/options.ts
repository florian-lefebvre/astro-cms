import { z } from "astro/zod";

export const optionsSchema = z
	.object({
		configFile: z.string().default("./cms.config.ts"),
		base: z.string().default("/cms"),
	})
	.default({});

export type IntegrationOptions = z.infer<typeof optionsSchema>;
