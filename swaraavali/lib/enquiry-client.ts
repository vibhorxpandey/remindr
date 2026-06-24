import { enquirySchema, type EnquiryInput, type SubmitResult } from "@/lib/schema";

/**
 * Client-side enquiry submission.
 *
 * The Phase 1 static build (GitHub Pages) has no server, so this validates +
 * honeypot-checks and resolves success — real enrollments come in via the
 * WhatsApp / phone / email links shown alongside the form.
 *
 * TODO(Phase 2): on a Node/Vercel host, swap the body for a POST to an API
 * route (or a Server Action) that rate-limits, persists, and emails the lead.
 */
export async function submitEnquiry(values: EnquiryInput): Promise<SubmitResult> {
  const parsed = enquirySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  // Honeypot: silently succeed (drop) if the hidden field was filled.
  if (parsed.data.company) return { ok: true };
  return { ok: true };
}
