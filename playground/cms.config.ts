import { defineConfig, defineCollection, fields } from "astro-cms/config";

const posts = defineCollection({
	label: "Posts",
	format: "json",
	schema: {
		title: fields.string({
			label: "Title",
			validation: {
				optional: false,
			},
		}),
	},
});

const config = defineConfig({
	collections: {
		posts,
	},
});

export default config;
