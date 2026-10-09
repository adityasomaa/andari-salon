/**
 * One place that composes every WhatsApp message the site can produce.
 *
 * The message carries what the visitor actually wrote and nothing else: no
 * page URL, no button label, no template tag. It is written in the language
 * the visitor was reading, since it goes out from their phone in their name.
 */

import { getCopy } from "@/config/copy";
import type { Locale } from "@/config/i18n";
import { findService } from "@/config/services";
import { CONTACT } from "@/config/site";

import { formatLong } from "./dates";

export const WA_BASE = `https://wa.me/${CONTACT.whatsappE164}`;

export type BookingDetails = {
  name: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
};

/** Message for a completed booking form. Carries every field the visitor filled. */
export function buildBookingMessage(b: BookingDetails, locale: Locale): string {
  const { wa } = getCopy(locale);
  const f = wa.fields;
  const service = findService(b.serviceId);
  const serviceLine = service
    ? `${service.name[locale]} (${service.categoryName[locale]})`
    : b.serviceId;

  const lines = [
    wa.booking,
    "",
    `${f.name}: ${b.name}`,
    `${f.phone}: ${b.phone}`,
    `${f.service}: ${serviceLine}`,
    `${f.date}: ${formatLong(b.date, locale)}`,
    `${f.time}: ${b.time}`,
  ];
  if (b.notes && b.notes.trim()) lines.push(`${f.notes}: ${b.notes.trim()}`);
  return lines.join("\n");
}

export function waHref(message: string): string {
  return `${WA_BASE}?text=${encodeURIComponent(message)}`;
}
