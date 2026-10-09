"use client";

/**
 * The booking form. One implementation, three skins.
 *
 * Flow: the browser validates for fast feedback, then posts to
 * /api/booking, which validates the same schema again and composes the
 * WhatsApp message server side. The client never builds the final link, so
 * skipping the browser check cannot produce a message with a past date or an
 * unknown service in it.
 *
 * Submission ends on a review panel with a real anchor rather than a scripted
 * `window.open`. That avoids popup blocking entirely and lets the visitor read
 * what they are about to send.
 *
 * The form/panel swap is a plain conditional render, not `AnimatePresence
 * mode="wait"`. That mode holds the incoming element back until the outgoing
 * one finishes its exit animation, and exit animations are driven by
 * requestAnimationFrame: in a backgrounded tab the swap never happens and the
 * button sits on "Menyusun pesan" forever.
 */

import { motion } from "motion/react";
import { useCallback, useId, useMemo, useRef, useState } from "react";

import { SERVICES_ARE_SAMPLE, SERVICE_CATEGORIES, TIME_SLOTS, priceSummary } from "@/config/services";
import { collectErrors, makeBookingSchema, type FieldErrors } from "@/lib/booking-schema";
import { cn } from "@/lib/utils";

import { DatePicker } from "./date-picker";
import { Listbox, type ListboxGroup } from "./listbox";
import { useCopy, useLocale } from "./locale-context";

type Status = "idle" | "submitting" | "sent" | "error";

export function BookingForm({ className }: { className?: string }) {
  const locale = useLocale();
  const F = useCopy().form;
  const uid = useId().replace(/:/g, "");
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{ href: string; message: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const serviceGroups: ListboxGroup[] = useMemo(
    () =>
      SERVICE_CATEGORIES.filter((c) => c.bookable).map((c) => ({
        label: c.name[locale],
        options: c.items.map((s) => ({ value: s.id, label: s.name[locale], meta: priceSummary(s, locale) })),
      })),
    [locale],
  );

  const field = (key: string) => `${uid}-${key}`;

  const clearError = useCallback((key: keyof FieldErrors) => {
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const payload = {
      name,
      phone,
      serviceId: serviceId ?? "",
      date: date ?? "",
      time: time ?? "",
      notes,
      locale,
      website,
    };

    const parsed = makeBookingSchema(locale).safeParse(payload);
    if (!parsed.success) {
      const fe = collectErrors(parsed.error);
      setErrors(fe);
      setStatus("error");
      // Move focus to the first thing that needs fixing.
      const firstKey = Object.keys(fe)[0];
      if (firstKey) {
        document.getElementById(field(firstKey))?.focus();
      }
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) {
        // The server is the authority: surface its field errors verbatim.
        setErrors(body.errors ?? {});
        setFormError(body.errors ? null : F.errorNetwork);
        setStatus("error");
        return;
      }
      setResult({ href: body.href, message: body.message });
      setStatus("sent");
    } catch {
      setFormError(F.errorNetwork);
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    window.setTimeout(() => formRef.current?.querySelector<HTMLElement>("input")?.focus(), 40);
  }

  const invalidCount = Object.keys(errors).length;

  return (
    <div className={cn("relative w-full", className)}>
      {status === "sent" && result ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="t-card p-6 sm:p-8"
            role="status"
            aria-live="polite"
          >
            <h3 className="text-[length:var(--t-h3)] font-medium">{F.successTitle}</h3>
            <p className="t-body mt-2">{F.successBody}</p>
            <pre
              className="mt-5 max-h-64 overflow-auto p-4 text-[0.78rem] leading-relaxed whitespace-pre-wrap"
              style={{
                background: "var(--t-bg-alt)",
                border: "1px solid var(--t-line)",
                borderRadius: "var(--t-radius-sm)",
                color: "var(--t-fg-muted)",
              }}
              data-testid="wa-preview"
            >
              {result.message}
            </pre>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={result.href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-btn t-btn-primary"
                data-testid="wa-open"
              >
                {F.successOpen}
              </a>
              <button type="button" onClick={reset} className="t-btn t-btn-ghost">
                {F.successReset}
              </button>
            </div>
            <p className="mt-5 text-[length:var(--t-small)]" style={{ color: "var(--t-fg-faint)" }}>
              {F.confirmNote}
            </p>
          </motion.div>
        ) : (
          <form
            ref={formRef}
            id="form-booking"
            noValidate
            onSubmit={onSubmit}
            className="grid gap-5"
          >
            <fieldset className="grid gap-5 border-0 p-0">
              <legend className="sr-only">{F.legend}</legend>

              {invalidCount > 0 ? (
                <div
                  role="alert"
                  className="p-4 text-[length:var(--t-small)]"
                  style={{
                    border: "1px solid var(--t-line-strong)",
                    borderRadius: "var(--t-radius-sm)",
                    background: "var(--t-bg-alt)",
                  }}
                >
                  <strong className="font-medium">{F.errorTitle}</strong>
                  <ul className="mt-1.5 list-disc space-y-0.5 ps-5">
                    {Object.entries(errors).map(([k, msg]) => (
                      <li key={k}>
                        <a href={`#${field(k)}`} className="underline underline-offset-2">
                          {msg}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <Row>
                <Field
                  id={field("name")}
                  label={F.name.label}
                  hint={F.name.hint}
                  error={errors.name}
                >
                  <input
                    id={field("name")}
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="t-field"
                    placeholder={F.name.placeholder}
                    value={name}
                    aria-invalid={Boolean(errors.name) || undefined}
                    aria-describedby={describe(field("name"), errors.name)}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError("name");
                    }}
                  />
                </Field>

                <Field
                  id={field("phone")}
                  label={F.phone.label}
                  hint={F.phone.hint}
                  error={errors.phone}
                >
                  <input
                    id={field("phone")}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className="t-field"
                    placeholder={F.phone.placeholder}
                    value={phone}
                    aria-invalid={Boolean(errors.phone) || undefined}
                    aria-describedby={describe(field("phone"), errors.phone)}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      clearError("phone");
                    }}
                  />
                </Field>
              </Row>

              <Field
                id={field("serviceId")}
                label={F.service.label}
                hint={SERVICES_ARE_SAMPLE ? `${F.service.hint} ${F.service.sampleHint}` : F.service.hint}
                error={errors.serviceId}
              >
                <Listbox
                  id={field("serviceId")}
                  value={serviceId}
                  onChange={(v) => {
                    setServiceId(v);
                    clearError("serviceId");
                  }}
                  groups={serviceGroups}
                  placeholder={F.service.placeholder}
                  labelledBy={`${field("serviceId")}-label`}
                  describedBy={describe(field("serviceId"), errors.serviceId)}
                  invalid={Boolean(errors.serviceId)}
                />
              </Field>

              <div className="sm:max-w-sm">
                <Field id={field("date")} label={F.date.label} hint={F.date.hint} error={errors.date}>
                  <DatePicker
                    id={field("date")}
                    value={date}
                    onChange={(v) => {
                      setDate(v);
                      clearError("date");
                    }}
                    placeholder={F.date.placeholder}
                    labelledBy={`${field("date")}-label`}
                    describedBy={describe(field("date"), errors.date)}
                    invalid={Boolean(errors.date)}
                  />
                </Field>
              </div>

              <Field id={field("time")} label={F.time.label} hint={F.time.hint} error={errors.time}>
                <TimeSlots
                  id={field("time")}
                  value={time}
                  onChange={(v) => {
                    setTime(v);
                    clearError("time");
                  }}
                  labelledBy={`${field("time")}-label`}
                  describedBy={describe(field("time"), errors.time)}
                  invalid={Boolean(errors.time)}
                />
              </Field>

              <Field id={field("notes")} label={F.notes.label} hint={F.notes.hint} error={errors.notes}>
                <textarea
                  id={field("notes")}
                  name="notes"
                  rows={3}
                  className="t-field resize-y"
                  placeholder={F.notes.placeholder}
                  value={notes}
                  maxLength={400}
                  aria-describedby={describe(field("notes"), errors.notes)}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    clearError("notes");
                  }}
                />
              </Field>

              {/* Honeypot. Hidden with clip, never a negative offset. */}
              <div className="honeypot" aria-hidden>
                <label htmlFor={field("website")}>Website</label>
                <input
                  id={field("website")}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {formError ? (
                <p role="alert" className="t-error">
                  {formError}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="submit"
                  className="t-btn t-btn-primary"
                  disabled={status === "submitting"}
                  data-testid="booking-submit"
                >
                  {status === "submitting" ? F.submitting : F.submit}
                </button>
                <p className="t-body max-w-sm text-[length:var(--t-small)]">{F.confirmNote}</p>
              </div>
            </fieldset>
          </form>
        )}
    </div>
  );
}

function describe(id: string, error?: string) {
  return error ? `${id}-hint ${id}-error` : `${id}-hint`;
}

function Row({ children }: { children: React.ReactNode }) {
  // items-start: without it a tall cell (the time-slot grid) stretches its
  // sibling and the shorter field floats to the bottom of the row.
  return <div className="grid items-start gap-5 sm:grid-cols-2">{children}</div>;
}

/** Label above input, hint below label, error below the control. */
function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start gap-2">
      <label id={`${id}-label`} htmlFor={id} className="text-[length:var(--t-small)] font-medium">
        {label}
      </label>
      <span id={`${id}-hint`} className="text-[0.8rem]" style={{ color: "var(--t-fg-faint)" }}>
        {hint}
      </span>
      {children}
      {error ? (
        <p id={`${id}-error`} className="t-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Time as a radio group of slots, never free text. Arrow keys move between
 * slots the way a native radio group does.
 */
function TimeSlots({
  id,
  value,
  onChange,
  labelledBy,
  describedBy,
  invalid,
}: {
  id: string;
  value: string | null;
  onChange: (v: string) => void;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent) {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const cur = value ? TIME_SLOTS.indexOf(value as (typeof TIME_SLOTS)[number]) : -1;
    let next = cur;
    if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TIME_SLOTS.length - 1;
    else if (e.key === "ArrowRight" || e.key === "ArrowDown") next = cur < 0 ? 0 : Math.min(TIME_SLOTS.length - 1, cur + 1);
    else next = cur < 0 ? 0 : Math.max(0, cur - 1);
    onChange(TIME_SLOTS[next]);
    window.setTimeout(() => {
      wrapRef.current?.querySelector<HTMLElement>(`[data-slot="${TIME_SLOTS[next]}"]`)?.focus();
    }, 0);
  }

  return (
    <div
      ref={wrapRef}
      id={id}
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      onKeyDown={onKeyDown}
      className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7"
      style={
        invalid
          ? { outline: "1px solid #a4372a", outlineOffset: "6px", borderRadius: "var(--t-radius-sm)" }
          : undefined
      }
    >
      {TIME_SLOTS.map((slot) => {
        const active = slot === value;
        return (
          <button
            key={slot}
            type="button"
            role="radio"
            data-slot={slot}
            aria-checked={active}
            tabIndex={active || (!value && slot === TIME_SLOTS[0]) ? 0 : -1}
            onClick={() => onChange(slot)}
            className="min-h-11 px-2 text-[0.85rem] transition-colors"
            style={{
              border: "1px solid var(--t-line-strong)",
              borderRadius: "var(--t-radius-sm)",
              background: active ? "var(--t-accent)" : "transparent",
              color: active ? "var(--t-accent-fg)" : "var(--t-fg-muted)",
              fontWeight: active ? 500 : 400,
            }}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
