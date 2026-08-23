/**
 * First-party page-view endpoint, the thing cookie consent actually gates.
 *
 * It stores nothing and sets no cookie. It exists so the consent toggle has a
 * real, observable consequence: with analytics off no request is made at all,
 * which is verifiable in the network panel.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { path?: unknown };
    const path = typeof body.path === "string" ? body.path.slice(0, 200) : "unknown";
    console.log(`[pageview] ${path}`);
  } catch {
    /* malformed body is not worth an error response for a counter */
  }
  return new NextResponse(null, { status: 204 });
}
