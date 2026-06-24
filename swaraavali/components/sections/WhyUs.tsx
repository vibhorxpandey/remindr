"use client";

import { useLocale } from "@/lib/locale";
import { whyUs, t, type Locale } from "@/content/copy";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function WhyUs() {
  const { locale } = useLocale();
  const l = locale as Locale;

  return (
    <section className="bg-panel/30 relative scroll-mt-20 py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading eyebrow={whyUs.eyebrow} title={whyUs.title} />
            <Reveal delay={120}>
              <dl className="mt-10 flex gap-10">
                <div>
                  <dt className="text-muted text-sm tracking-widest uppercase">
                    {l === "en" ? "Students" : "विद्यार्थी"}
                  </dt>
                  <dd className="text-gold mt-1 text-4xl">{site.stats.students}</dd>
                </div>
                <div>
                  <dt className="text-muted text-sm tracking-widest uppercase">
                    {l === "en" ? "Course (months)" : "अवधि (माह)"}
                  </dt>
                  <dd className="text-gold mt-1 text-4xl">{site.stats.durationMonths}</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2">
            {whyUs.reasons.map((r, i) => (
              <Reveal as="li" key={r.title.en} delay={i * 100}>
                <div className="border-gold/15 bg-void/50 h-full rounded-[var(--radius-card)] border p-6">
                  <h3 className="text-cream text-lg">{t(r.title, l)}</h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    {t(r.body, l)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
