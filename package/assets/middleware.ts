import { defineMiddleware } from "astro:middleware";
// import { options, astroConfig } from "virtual:astro-cms/internal";
import { resolveConfig } from "../src/config.js";
import { rawConfig } from "virtual:astro-cms/raw-config";

// const USERNAME = "abc";
// const PASSWORD = "def";

// const isAuthorized = (value: string | null): boolean => {
// 	if (!value) return false;
// 	if (!value.startsWith("Basic ")) return false;

// 	const encoded = value.slice(6);
// 	const decoded = Buffer.from(encoded, "base64").toString();
// 	const parts = decoded.split(":");

// 	// biome-ignore lint/style/noNonNullAssertion: <explanation>
// 	const username = parts[0]!;
// 	const password = parts.slice(1).join(":");

// 	return username === USERNAME && password === PASSWORD;
// };

export const onRequest = defineMiddleware(async (context, next) => {
	// console.dir({ options, astroConfig }, { depth: null });

	const resolvedConfig = resolveConfig(rawConfig);
	// console.dir({ resolvedConfig }, { depth: null });

	context.locals.__cms = {
		resolvedConfig,
	};

	next();

	// const _res = await next();

	// const authorized = isAuthorized(context.request.headers.get("Authorization"));

	// if (!authorized) {
	// 	_res.headers.append(
	// 		"WWW-Authenticate",
	// 		'Basic realm="Access to the staging site", charset="UTF-8"',
	// 	);
	// 	const res = new Response(_res.body, {
	// 		headers: _res.headers,
	// 		status: 401,
	// 	});
	// 	return res;
	// }
});
