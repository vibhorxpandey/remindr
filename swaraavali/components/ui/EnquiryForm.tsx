"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "@/lib/locale";
import { contact, instrumentsList, t, type Locale } from "@/content/copy";
import { enquirySchema, DISCIPLINES, type EnquiryInput } from "@/lib/schema";
import { submitEnquiry } from "@/app/actions";
import { Button } from "./Button";

const inputCls =
  "w-full rounded-lg border border-gold/20 bg-void/60 px-4 py-3 text-cream placeholder:text-muted/60 focus:border-gold focus:outline-none";
const labelCls = "mb-1.5 block text-sm font-medium text-cream";
const errCls = "mt-1 text-xs text-red-400";

export function EnquiryForm() {
  const { locale } = useLocale();
  const l = locale as Locale;
  const f = contact.form;
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { discipline: undefined, consent: false as unknown as true },
  });

  const discipline = watch("discipline");

  async function onSubmit(values: EnquiryInput) {
    setServerError(null);
    const result = await submitEnquiry(values);
    if (result.ok) {
      setSubmitted(true);
      return;
    }
    if (result.fieldErrors) {
      for (const [key, message] of Object.entries(result.fieldErrors)) {
        setError(key as keyof EnquiryInput, { message });
      }
    }
    setServerError(result.error ?? t(f.errorGeneric, l));
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="border-gold/30 bg-panel/60 rounded-[var(--radius-card)] border p-10 text-center"
      >
        <p className="text-gold text-2xl">{t(f.successTitle, l)}</p>
        <p className="text-muted mt-3">{t(f.successBody, l)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            {t(f.name, l)}
          </label>
          <input
            id="name"
            className={inputCls}
            autoComplete="name"
            {...register("name")}
          />
          {errors.name && <p className={errCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>
            {t(f.phone, l)}
          </label>
          <input
            id="phone"
            className={inputCls}
            inputMode="tel"
            autoComplete="tel"
            {...register("phone")}
          />
          {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>
          {t(f.email, l)}
        </label>
        <input
          id="email"
          type="email"
          className={inputCls}
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <p className={errCls}>{errors.email.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="discipline" className={labelCls}>
            {t(f.discipline, l)}
          </label>
          <select
            id="discipline"
            className={inputCls}
            defaultValue=""
            {...register("discipline")}
          >
            <option value="" disabled>
              {l === "en" ? "Select…" : "चुनें…"}
            </option>
            {DISCIPLINES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.discipline && <p className={errCls}>{errors.discipline.message}</p>}
        </div>

        {/* Conditional instrument select */}
        {discipline === "Instrument" && (
          <div>
            <label htmlFor="instrument" className={labelCls}>
              {t(f.instrument, l)}
            </label>
            <select
              id="instrument"
              className={inputCls}
              defaultValue=""
              {...register("instrument")}
            >
              <option value="" disabled>
                {l === "en" ? "Select…" : "चुनें…"}
              </option>
              {instrumentsList.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            {errors.instrument && <p className={errCls}>{errors.instrument.message}</p>}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="preferredBatch" className={labelCls}>
          {t(f.batch, l)}{" "}
          <span className="text-muted">({l === "en" ? "optional" : "वैकल्पिक"})</span>
        </label>
        <input
          id="preferredBatch"
          className={inputCls}
          placeholder={l === "en" ? "e.g. Evening, weekends" : "जैसे शाम, सप्ताहांत"}
          {...register("preferredBatch")}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          {t(f.message, l)}{" "}
          <span className="text-muted">({l === "en" ? "optional" : "वैकल्पिक"})</span>
        </label>
        <textarea id="message" rows={4} className={inputCls} {...register("message")} />
      </div>

      {/* Honeypot — visually hidden, off the tab order, ignored by humans. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div>
        <label className="text-muted flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-[var(--color-gold)]"
            {...register("consent")}
          />
          <span>{t(f.consent, l)}</span>
        </label>
        {errors.consent && <p className={errCls}>{errors.consent.message}</p>}
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-red-400">
          {serverError}
        </p>
      )}

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t(f.submitting, l) : t(f.submit, l)}
        </Button>
      </div>
    </form>
  );
}
