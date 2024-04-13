import type { APIRoute } from "astro";

export const prerender = false;

export const DELETE: APIRoute = () => {
    return Response.json({})
}

export const GET: APIRoute = () => {
    return Response.json({})
}

export const PUT: APIRoute = () => {
	return Response.json({});
};