/**
 * Server-side validation for the booking form.
 *
 * This is the authoritative pass. The browser runs the same schema first for
 * fast feedback, but a request that skips it, replays an old payload or sends
 * a hand-rolled body lands here and gets the same rules applied, including
 * "the date is not in the past", evaluated against the salon's timezone rather
 * than the caller's.
 *
 * The WhatsApp link is composed here too, so a client can never talk the site
 * into producing a message for a service that does not exist.
 */

import { NextResponse } from "next/server";

import { bookingSchema, collectErrors } from "@/lib/booking-schema";
import { buildBookingMessage, waHref } from "@/lib/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: {} }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: collectErrors(parsed.error) },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot filled means a bot. Answer 200 with nothing useful rather than
  // telling the bot which check it failed.
  if (data.website) {
    return NextResponse.json({ ok: true, href: null, message: "" }, { status: 200 });
  }

  const message = buildBookingMessage({
    name: data.name,
    phone: data.phone,
    serviceId: data.serviceId,
    date: data.date,
    time: data.time,
    notes: data.notes,
  });

  return NextResponse.json({ ok: true, href: waHref(message), message });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "POST only" }, { status: 405 });
}
