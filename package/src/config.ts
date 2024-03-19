export type StringField = {
	type: "string";
	label: string;
	description?: string | undefined;
	validation?: {
		optional?: boolean;
		default?: string;
	};
	transform?: (v: string) => any;
};

export type Field = StringField;

export type Collection = {
	label: string;
	format: "md" | "mdx" | "mdoc" | "json" | "toml";
	schema: Record<string, Field>;
};

export type Config = {
	collections: Record<string, Collection>;
};

export type ResolvedConfig = {
	collections: Array<Collection & { id: string }>;
};

export const fields = {
	string: (field: Omit<StringField, "type">): StringField => ({
		...field,
		type: "string",
	}),
};

export const defineCollection = (collection: Collection) => collection;

export const defineConfig = (config: Config) => config;

export const resolveConfig = (config: Config): ResolvedConfig => {
	return {
		collections: Object.entries(config.collections).map(([key, value]) => ({
			...value,
			id: key,
		})),
	};
};