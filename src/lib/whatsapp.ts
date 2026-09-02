/**
 * One place that composes every WhatsApp message the site can produce.
 *
 * The message carries what the visitor actually wrote and nothing else. It
 * used to append a provenance block naming the page URL, the button pressed
 * and which preview was open, which was useful while three designs were being
 * compared but reads like machine output to the person receiving it.
 *
 * If that tracing is ever wanted back, it belongs behind PREVIEW_MODE rather
 * than in every message a real customer sends.
 */

import { CONTACT, SITE } from "@/config/site";
import { findService } from "@/config/services";
import { formatLongID } from "./dates";

export const WA_BASE = `https://wa.me/${CONTACT.whatsappE164}`;

/** Message for any plain "contact us" button. */
export function buildGeneralMessage(): string {
  return `Halo ${SITE.name}, saya ingin bertanya.`;
}

export type BookingDetails = {
  name: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
};

/** Message for a completed booking form. Carries every field the visitor filled. */
export function buildBookingMessage(b: BookingDetails): string {
  const service = findService(b.serviceId);
  const serviceLine = service ? `${service.name} (${service.categoryName})` : b.serviceId;

  const lines = [
    `Halo ${SITE.name}, saya ingin booking.`,
    "",
    `Nama: ${b.name}`,
    `WhatsApp: ${b.phone}`,
    `Layanan: ${serviceLine}`,
    `Tanggal: ${formatLongID(b.date)}`,
    `Jam: ${b.time}`,
  ];
  if (b.notes && b.notes.trim()) lines.push(`Catatan: ${b.notes.trim()}`);
  return lines.join("\n");
}

export function waHref(message: string): string {
  return `${WA_BASE}?text=${encodeURIComponent(message)}`;
}
