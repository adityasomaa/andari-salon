/**
 * One schema, run twice: in the browser for instant feedback, and again in the
 * route handler before any message is composed. The server pass is the one
 * that counts, since the client one can be skipped entirely.
 */

import { z } from "zod";

import { BOOKING_WINDOW_DAYS, SERVICE_IDS, TIME_SLOTS } from "@/config/services";
import { addDaysISO, isValidISODate, todayISO } from "./dates";

/**
 * Indonesian mobile numbers, normalised before they are judged.
 *
 * A pattern that expects separators in fixed positions rejects most of the
 * ways people actually write their number: 0812-3456-7890, 0812 3456 7890,
 * +62 812 3456 7890. Strip everything that is not a digit first, then check
 * the digits, then hand back one canonical 08 form for the WhatsApp message.
 *
 * Returns null when the number cannot be read as an Indonesian mobile.
 */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;

  let local: string;
  if (digits.startsWith("62")) local = `0${digits.slice(2)}`;
  else if (digits.startsWith("0")) local = digits;
  else if (digits.startsWith("8")) local = `0${digits}`;
  else return null;

  // 08 + operator prefix + subscriber number: 10 to 14 digits in total.
  return /^08[1-9]\d{7,11}$/.test(local) ? local : null;
}

export const bookingSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 huruf.")
      .max(80, "Nama terlalu panjang.")
      .regex(/[^\d\s]/, "Nama harus berisi huruf."),

    // Stored as the normalised 08 form, whatever the visitor typed.
    phone: z
      .string()
      .trim()
      .min(9, "Nomor WhatsApp terlalu pendek.")
      .max(24, "Nomor WhatsApp terlalu panjang.")
      .transform((v, ctx) => {
        const local = normalizePhone(v);
        if (!local) {
          ctx.addIssue({
            code: "custom",
            message: "Nomor WhatsApp belum benar. Contoh: 081234567890 atau +62 812 3456 7890.",
          });
          return z.NEVER;
        }
        return local;
      }),

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

    /**
     * Honeypot. Positioned with `clip`, never `left:-9999px`, so it cannot
     * create a horizontal scrollbar. Bots fill it, humans never see it.
     *
     * Deliberately not constrained here. Failing validation would answer 422
     * and tell the bot exactly which check it tripped; the route handler
     * instead answers 200 with nothing useful attached.
     */
    website: z.string().max(200).optional().default(""),
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
