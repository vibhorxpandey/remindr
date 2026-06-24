"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { footer, t, type Locale } from "@/content/copy";
import { site, formatAddress, whatsappLink } from "@/content/site";

export function Footer() {
  const { locale } = useLocale();
  const l = locale as Locale;

  return (
    <footer className="border-gold/10 bg-panel/40 relative border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3">
        {/* Brand + punchline */}
        <div>
          <p className="text-gold font-[family-name:var(--font-tiro)] text-2xl">
            {site.nameDevanagari}
          </p>
          <p className="text-cream mt-1 font-[family-name:var(--font-display)] text-xl">
            {site.shortName}
          </p>
          <p className="text-muted mt-4 max-w-xs text-sm leading-relaxed">
            {t(footer.punchline, l)}
          </p>
        </div>

        {/* NAP — consistent with schema for local SEO */}
        <address className="text-muted text-sm leading-relaxed not-italic">
          <p className="text-gold mb-2 font-semibold tracking-widest uppercase">
            {l === "en" ? "Visit us" : "हमसे मिलें"}
          </p>
          <p>{formatAddress()}</p>
          <p className="mt-3 flex flex-col gap-1">
            {site.contact.phones.map((p) => (
              <a key={p} href={`tel:+91${p}`} className="hover:text-gold">
                +91 {p}
              </a>
            ))}
            <a href={`mailto:${site.contact.email}`} className="hover:text-gold">
              {site.contact.email}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-maroon"
            >
              {l === "en" ? "Chat on WhatsApp →" : "व्हाट्सऐप पर चैट →"}
            </a>
          </p>
        </address>

        {/* Quick links */}
        <nav aria-label="Footer" className="text-sm">
          <p className="text-gold mb-2 font-semibold tracking-widest uppercase">
            {l === "en" ? "Explore" : "खोजें"}
          </p>
          <ul className="text-muted flex flex-col gap-2">
            <li>
              <Link href="/#disciplines" className="hover:text-gold">
                {l === "en" ? "Disciplines" : "विधाएँ"}
              </Link>
            </li>
            <li>
              <Link href="/#programs" className="hover:text-gold">
                {l === "en" ? "Programs" : "कार्यक्रम"}
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-gold">
                {l === "en" ? "Gallery" : "गैलरी"}
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-gold">
                {l === "en" ? "Events" : "आयोजन"}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                {l === "en" ? "Enroll / Contact" : "प्रवेश / संपर्क"}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="raga-rule mx-auto max-w-6xl" />
      <div className="text-muted mx-auto max-w-6xl px-5 py-6 text-xs sm:px-8">
        © {new Date().getFullYear()} {site.name}. {t(footer.rights, l)}
      </div>
    </footer>
  );
}
