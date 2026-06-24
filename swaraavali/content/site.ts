/**
 * Single source of truth for institute identity, NAP (Name/Address/Phone),
 * and contact channels. Consumed by SEO schema, footer, contact page, and
 * structured data. Keep this accurate — local SEO depends on NAP consistency.
 */

export const site = {
  name: "Swaraavali Institute of Music & Fine Arts",
  shortName: "Swaraavali",
  nameDevanagari: "स्वरावली",
  // "Swaraavali" = swar (note) + aavali (garland) — a garland of musical notes.
  tagline: "A garland of notes, a lifetime of music.",
  description:
    "Swaraavali Institute of Music & Fine Arts in Karvi, Chitrakoot teaches classical, folk & light vocals, a wide range of instruments, and Kathak & Bundelkhand folk dance — practical and theory, for all ages.",

  // Set NEXT_PUBLIC_SITE_URL in production. Falls back for local/dev.
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000",

  locale: "en_IN",

  contact: {
    // TODO(confirm): email flagged as possibly misspelled; using as provided.
    email: "Simfacktd@gmail.com",
    phones: ["9918362336", "8787059705"],
    // WhatsApp uses E.164 without '+' for the wa.me link. Assuming India (+91).
    whatsapp: "919918362336",
  },

  address: {
    street: "Dwarikapoori, Pandey Colony, near Chandralok Showroom",
    locality: "Karvi",
    region: "Uttar Pradesh",
    district: "Chitrakoot",
    postalCode: "210205",
    country: "IN",
    // Approx. coordinates for Karvi (Karwi), Chitrakoot. TODO(confirm): exact pin.
    geo: { lat: 25.1869, lng: 80.8997 },
  },

  // TODO(confirm): hours not provided; sensible default for a local institute.
  openingHours: [
    { days: ["Mo", "Tu", "We", "Th", "Fr", "Sa"], opens: "09:00", closes: "19:00" },
  ],

  social: {
    // TODO(confirm): add real profile URLs when available.
    instagram: "",
    youtube: "",
    facebook: "",
  },

  stats: {
    students: "100+",
    // Course duration confirmed as months.
    durationMonths: "6–12",
  },
} as const;

export type Site = typeof site;

/** Full one-line postal address for display + schema. */
export function formatAddress(): string {
  const a = site.address;
  return `${a.street}, ${a.locality}, ${a.district}, ${a.region} ${a.postalCode}`;
}

/** wa.me click-to-chat URL with a friendly prefilled message. */
export function whatsappLink(
  message = "Hello Swaraavali! I'd like to know more about enrolling."
): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
