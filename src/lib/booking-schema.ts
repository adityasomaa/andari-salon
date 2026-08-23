/**
 * One schema, run twice: in the browser for instant feedback, and again in the
 * route handler before any message is composed. The server pass is the one
 * that counts, since the client one can be skipped entirely.
 */

import { z } from "zod";

import { BOOKING_WINDOW_DAYS, SERVICE_IDS, TIME_SLOTS } from "@/config/services";
import { TEMPLATES } from "@/config/site";
import { addDaysISO, isValidISODate, todayISO } from "./dates";

const TEMPLATE_IDS = TEMPLATES.map((t) => t.id) as [string, ...string[]];

/** Accepts 08xxxxxxxx, 62xxxxxxxx, +62xxxxxxxx, with spaces, dots or dashes. */
const PHONE_RE = /^(?:\+?62|0)[\s.-]?8[1-9][\s.-]?\d{2,3}[\s.-]?\d{3,4}[\s.-]?\d{2,5}$/;

export const bookingSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 huruf.")
      .max(80, "Nama terlalu panjang.")
      .regex(/[^\d\s]/, "Nama harus berisi huruf."),

    phone: z
      .string()
      .trim()
      .min(9, "Nomor WhatsApp terlalu pendek.")
      .max(20, "Nomor WhatsApp terlalu panjang.")
      .regex(PHONE_RE, "Nomor WhatsApp belum benar. Contoh: 081234567890."),

    serviceId: z.string().refine((v) => SERVICE_IDS.includes(v), "Pilih salah satu layanan."),

    date: z
      .string()
      .refine(isValidISODate, "Pilih tanggal yang benar.")
      // Checked again against the salon's timezone, not the visitor's.
      .refine((v) => v >= todayISO(), "Tanggal yang sudah lewat tidak bisa dipilih.")
      .refine(
        (v) => v <= addDaysISO(todayISO(), BOOKING_WINDOW_DAYS),
        `Booking hanya sampai ${BOOKING_WINDOW_DAYS} hari ke depan.`,
      ),

    time: z
      .string()
      .refine((v) => (TIME_SLOTS as readonly string[]).includes(v), "Pilih salah satu jam."),

    notes: z.string().trim().max(400, "Catatan maksimal 400 karakter.").optional().default(""),

    /** Provenance, so the composed message can say where it came from. */
    pageUrl: z.string().trim().max(500).optional().default(""),
    templateId: z.enum(TEMPLATE_IDS).optional(),
    buttonLabel: z.string().trim().max(120).optional().default("Susun pesan WhatsApp"),

    /**
     * Honeypot. Positioned with `clip`, never `left:-9999px`, so it cannot
     * create a horizontal scrollbar. Bots fill it, humans never see it.
     */
    website: z.string().max(0, "").optional().default(""),
  })
  .strict();

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingParsed = z.output<typeof bookingSchema>;

/** Field-keyed errors, the shape the form renders directly. */
export type FieldErrors = Partial<Record<keyof BookingParsed, string>>;

export function collectErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof BookingParsed | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** The fields the visitor actually fills, in tab order. */
export const BOOKING_FIELDS = [
  "name",
  "phone",
  "serviceId",
  "date",
  "time",
  "notes",
] as const;
