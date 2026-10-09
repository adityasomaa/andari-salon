/**
 * One schema, run twice: in the browser for instant feedback, and again in the
 * route handler before any message is composed. The server pass is the one
 * that counts, since the client one can be skipped entirely.
 *
 * The rules are the same in both languages; only the error wording changes.
 */

import { z } from "zod";

import { LOCALES, type Locale } from "@/config/i18n";
import { BOOKING_WINDOW_DAYS, SERVICE_IDS, TIME_SLOTS } from "@/config/services";

import { addDaysISO, isValidISODate, todayISO } from "./dates";

/**
 * Phone numbers, normalised before they are judged.
 *
 * A pattern that expects separators in fixed positions rejects most of the
 * ways people actually write their number: 0812-3456-7890, 0812 3456 7890,
 * +62 812 3456 7890. Strip everything that is not a digit first, then check
 * the digits.
 *
 * Indonesian mobiles come back in the canonical 08 form. A number written
 * with a "+" and another country code is accepted too, because the English
 * pages are read by visitors on foreign SIMs, and comes back as +digits.
 * Without the "+" there is no telling a foreign number from a mistyped local
 * one, so that case is still refused.
 *
 * Returns null when the number cannot be read either way.
 */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^\d]/g, "");
  if (!digits) return null;

  if (trimmed.startsWith("+") && !digits.startsWith("62")) {
    // E.164: a country code that does not start with 0, 8 to 15 digits total.
    return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : null;
  }

  let local: string;
  if (digits.startsWith("62")) local = `0${digits.slice(2)}`;
  else if (digits.startsWith("0")) local = digits;
  else if (digits.startsWith("8")) local = `0${digits}`;
  else return null;

  // 08 + operator prefix + subscriber number: 10 to 14 digits in total.
  return /^08[1-9]\d{7,11}$/.test(local) ? local : null;
}

const MESSAGES = {
  id: {
    nameMin: "Nama minimal 2 huruf.",
    nameMax: "Nama terlalu panjang.",
    nameLetters: "Nama harus berisi huruf.",
    phoneShort: "Nomor WhatsApp terlalu pendek.",
    phoneLong: "Nomor WhatsApp terlalu panjang.",
    phoneInvalid:
      "Nomor WhatsApp belum benar. Contoh: 081234567890, +62 812 3456 7890, atau nomor luar negeri dengan kode negara.",
    service: "Pilih salah satu treatment.",
    dateInvalid: "Pilih tanggal yang benar.",
    datePast: "Tanggal yang sudah lewat tidak bisa dipilih.",
    dateFar: `Booking hanya sampai ${BOOKING_WINDOW_DAYS} hari ke depan.`,
    time: "Pilih salah satu jam.",
    notes: "Catatan maksimal 400 karakter.",
  },
  en: {
    nameMin: "Your name needs at least 2 letters.",
    nameMax: "That name is too long.",
    nameLetters: "Your name needs to contain letters.",
    phoneShort: "That WhatsApp number is too short.",
    phoneLong: "That WhatsApp number is too long.",
    phoneInvalid:
      "That WhatsApp number does not look right. Include the country code, e.g. +61 412 345 678 or +62 812 3456 7890.",
    service: "Choose one of the treatments.",
    dateInvalid: "Choose a valid date.",
    datePast: "Past dates cannot be chosen.",
    dateFar: `Bookings can only be made up to ${BOOKING_WINDOW_DAYS} days ahead.`,
    time: "Choose one of the times.",
    notes: "Notes can be up to 400 characters.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function makeBookingSchema(locale: Locale) {
  const m = MESSAGES[locale];
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, m.nameMin)
        .max(80, m.nameMax)
        .regex(/[^\d\s]/, m.nameLetters),

      // Stored normalised, whatever the visitor typed.
      phone: z
        .string()
        .trim()
        .min(9, m.phoneShort)
        .max(24, m.phoneLong)
        .transform((v, ctx) => {
          const normalised = normalizePhone(v);
          if (!normalised) {
            ctx.addIssue({ code: "custom", message: m.phoneInvalid });
            return z.NEVER;
          }
          return normalised;
        }),

      serviceId: z.string().refine((v) => SERVICE_IDS.includes(v), m.service),

      date: z
        .string()
        .refine(isValidISODate, m.dateInvalid)
        // Checked again against the salon's timezone, not the visitor's.
        .refine((v) => v >= todayISO(), m.datePast)
        .refine((v) => v <= addDaysISO(todayISO(), BOOKING_WINDOW_DAYS), m.dateFar),

      time: z.string().refine((v) => (TIME_SLOTS as readonly string[]).includes(v), m.time),

      notes: z.string().trim().max(400, m.notes).optional().default(""),

      /** Which language the visitor was reading. Sets the message language. */
      locale: z.enum(LOCALES).optional().default("id"),

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
}

export type BookingSchema = ReturnType<typeof makeBookingSchema>;
export type BookingInput = z.input<BookingSchema>;
export type BookingParsed = z.output<BookingSchema>;

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
