"use client";

import { useLocale } from "@/lib/locale";
import { contact, t, type Locale } from "@/content/copy";
import { site, formatAddress, whatsappLink } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnquiryForm } from "@/components/ui/EnquiryForm";
import { Reveal } from "@/components/ui/Reveal";

export function Contact() {
  const { locale } = useLocale();
  const l = locale as Locale;

  // OpenStreetMap embed (no API key, privacy-light). Centered on Karvi.
  const { lat, lng } = site.address.geo;
  const bbox = `${lng - 0.02}%2C${lat - 0.02}%2C${lng + 0.02}%2C${lat + 0.02}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <section id="contact" className="bg-panel/30 relative scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={contact.eyebrow} title={contact.title} align="center" />
        <p className="text-muted mx-auto mt-4 max-w-xl text-center">
          {t(contact.subtitle, l)}
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="border-gold/15 bg-void/50 rounded-[var(--radius-card)] border p-6 sm:p-8">
              <EnquiryForm />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex flex-col gap-6">
              {/* Direct contact */}
              <div className="border-gold/15 bg-void/50 rounded-[var(--radius-card)] border p-6">
                <h3 className="text-cream text-lg">
                  {l === "en" ? "Reach us directly" : "सीधे संपर्क करें"}
                </h3>
                <ul className="mt-4 flex flex-col gap-3 text-sm">
                  {site.contact.phones.map((p) => (
                    <li key={p}>
                      <a
                        href={`tel:+91${p}`}
                        className="text-cream hover:text-gold flex items-center gap-2"
                      >
                        <span aria-hidden>📞</span> +91 {p}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold-hi flex items-center gap-2 font-semibold"
                    >
                      <span aria-hidden>💬</span>
                      {l === "en" ? "Chat on WhatsApp" : "व्हाट्सऐप पर चैट करें"}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="text-cream hover:text-gold flex items-center gap-2"
                    >
                      <span aria-hidden>✉️</span> {site.contact.email}
                    </a>
                  </li>
                </ul>
                <address className="border-gold/15 text-muted mt-5 border-t pt-4 text-sm leading-relaxed not-italic">
                  {formatAddress()}
                </address>
              </div>

              {/* Map */}
              <div className="border-gold/15 overflow-hidden rounded-[var(--radius-card)] border">
                <iframe
                  title={`Map to ${site.name}`}
                  src={mapSrc}
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
