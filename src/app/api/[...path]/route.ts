// src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

// ✅ REQUIRED for output: "export"
export const dynamic = "force-dynamic";

const GATEWAY_BASE = (
  process.env.NEXT_PUBLIC_GATEWAY_BASE_URL ||
  process.env.NEXT_PUBLIC_LAMBDA_URL ||
  "https://4fqbpp1yya.execute-api.ap-south-1.amazonaws.com/prod"
).replace(/\/$/, "");

const STAGE = process.env.NEXT_PUBLIC_API_STAGE || "prod";

function buildTargetUrl(req: NextRequest, pathParts: string[]) {
  const incomingPath = "/" + pathParts.join("/");

  const baseHasStage =
    new RegExp(`/${STAGE}$`).test(GATEWAY_BASE) ||
    new RegExp(`/${STAGE}/`).test(GATEWAY_BASE);

  const base = baseHasStage ? GATEWAY_BASE : `${GATEWAY_BASE}/${STAGE}`;

  const url = new URL(base + incomingPath);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  return url.toString();
}

async function proxy(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const targetUrl = buildTargetUrl(req, path);

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    cache: "no-store",
  });

  const resBody = await upstream.arrayBuffer();
  const resHeaders = new Headers(upstream.headers);

  if (!resHeaders.get("content-type")) {
    resHeaders.set("content-type", "application/json");
  }

  return new NextResponse(resBody, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
