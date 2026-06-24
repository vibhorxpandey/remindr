"use server";

import { enquirySchema, type SubmitResult } from "@/lib/schema";

/**
 * submitEnquiry — Server Action.
 *
 * Phase 1: validates input + honeypot and returns a typed result so the base
 * site form is fully functional and convertible.
 *
 * TODO(Phase 2): add Upstash rate-limit (by hashed IP), Drizzle insert, and
 * Resend transactional emails (institute notification + branded auto-reply).
 */
export async function submitEnquiry(raw: unknown): Promise<SubmitResult> {
  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "Please check the form and try again.", fieldErrors };
  }

  // Honeypot: silently succeed (drop) if the hidden field was filled.
  if (parsed.data.company) {
    return { ok: true };
  }

  // TODO(Phase 2): persist + email. For now, log server-side only.
  console.info("[enquiry] received", {
    name: parsed.data.name,
    discipline: parsed.data.discipline,
    instrument: parsed.data.instrument,
  });

  return { ok: true };
}
