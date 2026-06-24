/**
 * Structured-data (JSON-LD) builders. Validated shapes for MusicSchool /
 * LocalBusiness, Course, and Event. Inlined into pages via <script>.
 */
import { site, formatAddress } from "@/content/site";
import { disciplines } from "@/content/copy";

const sameAs = Object.values(site.social).filter(Boolean);

/** MusicSchool + LocalBusiness for the homepage / global footer. */
export function musicSchoolJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["MusicSchool", "LocalBusiness"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: site.url,
    email: site.contact.email,
    telephone: site.contact.phones.map((p) => `+91${p}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.geo.lat,
      longitude: site.address.geo.lng,
    },
    openingHoursSpecification: site.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: `${site.address.locality}, ${site.address.district}, ${site.address.region}`,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** One Course node per discipline. */
export function coursesJsonLd() {
  return disciplines.list.map((d) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${d.title.en} at ${site.shortName}`,
    description: d.punchline.en,
    provider: {
      "@type": "MusicSchool",
      name: site.name,
      sameAs: site.url,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      location: {
        "@type": "Place",
        name: site.name,
        address: formatAddress(),
      },
    },
  }));
}

export type EventInput = {
  title: string;
  description: string;
  startsAt: string; // ISO
  endsAt?: string;
  location?: string;
};

/** Event node for the events page. */
export function eventJsonLd(e: EventInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    description: e.description,
    startDate: e.startsAt,
    ...(e.endsAt ? { endDate: e.endsAt } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: e.location ?? site.name,
      address: formatAddress(),
    },
    organizer: {
      "@type": "MusicSchool",
      name: site.name,
      url: site.url,
    },
  };
}

/** Helper to render a JSON-LD <script> payload string. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data);
}
