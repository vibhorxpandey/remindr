import { z } from "zod";
import { instrumentsList } from "@/content/copy";

/**
 * Enquiry validation — the single boundary schema shared by the client form
 * (RHF resolver) and the server action (re-validation). Type-safe end to end.
 */
export const DISCIPLINES = ["Vocal", "Instrument", "Dance"] as const;

const phoneRegex = /^[0-9+\-\s()]{7,15}$/;

export const enquirySchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(80),
    phone: z.string().trim().regex(phoneRegex, "Enter a valid phone number"),
    email: z.string().trim().email("Enter a valid email").max(120),
    discipline: z.enum(DISCIPLINES, {
      message: "Please choose a discipline",
    }),
    instrument: z.enum(instrumentsList).optional(),
    preferredBatch: z.string().trim().max(80).optional().or(z.literal("")),
    message: z.string().trim().max(1000).optional().or(z.literal("")),
    consent: z.literal(true, {
      message: "Please agree to be contacted",
    }),
    // Honeypot — must stay empty. Bots tend to fill every field.
    company: z.string().max(0).optional().or(z.literal("")),
  })
  .refine((data) => data.discipline !== "Instrument" || Boolean(data.instrument), {
    path: ["instrument"],
    message: "Please choose an instrument",
  });

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
