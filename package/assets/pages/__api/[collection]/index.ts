import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = () => {
    return Response.json([])
}

export const POST: APIRoute = () => {
    return Response.json({})
}