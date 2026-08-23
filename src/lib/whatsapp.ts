/**
 * One place that composes every WhatsApp message the site can produce.
 *
 * Two shapes, both of which always carry provenance: the page the visitor was
 * on, the button they pressed, and which of the three previews they were
 * looking at. The provenance block disappears on its own once PREVIEW_MODE is
 * turned off, because a live site has only one design.
 */

import { CONTACT, SITE, TEMPLATES, type TemplateId } from "@/config/site";
import { PREVIEW_MODE } from "@/config/preview";
import { findService } from "@/config/services";
import { formatLongID } from "./dates";

export const WA_BASE = `https://wa.me/${CONTACT.whatsappE164}`;

export type Provenance = {
  /** Absolute URL of the page the visitor pressed the button on. */
  pageUrl: string;
  /** Human label of the control, so the salon knows the intent. */
  buttonLabel: string;
  templateId?: TemplateId | null;
};

function templateName(id?: TemplateId | null): string | null {
  if (!id) return null;
  const t = TEMPLATES.find((x) => x.id === id);
  return t ? `${t.number} ${t.name}` : id;
}

function provenanceLines(p: Provenance): string[] {
  const lines = ["Dikirim dari", `Halaman: ${p.pageUrl}`, `Tombol: ${p.buttonLabel}`];
  if (PREVIEW_MODE) {
    const name = templateName(p.templateId);
    if (name) lines.push(`Template: ${name}`);
  }
  return lines;
}

/** Message for any plain "contact us" button. */
export function buildGeneralMessage(p: Provenance): string {
  return [`Halo ${SITE.name}, saya ingin bertanya.`, "", ...provenanceLines(p)].join("\n");
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
export function buildBookingMessage(b: BookingDetails, p: Provenance): string {
  const service = findService(b.serviceId);
  const serviceLine = service
    ? `${service.name} (${service.categoryName})`
    : b.serviceId;

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
  lines.push("", ...provenanceLines(p));
  return lines.join("\n");
}

export function waHref(message: string): string {
  return `${WA_BASE}?text=${encodeURIComponent(message)}`;
}

/**
 * Absolute page URL. Prefers the live browser location so the message reflects
 * exactly what the visitor had open, including the preview domain, and falls
 * back to the configured origin during server rendering.
 */
export function currentPageUrl(pathname?: string): string {
  if (typeof window !== "undefined") {
    return window.location.href.split("#")[0];
  }
  return `${SITE.url}${pathname ?? ""}`;
}
