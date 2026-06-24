"use client";

import { useLocale } from "@/lib/locale";
import { programs, t, type Locale } from "@/content/copy";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Programs() {
  const { locale } = useLocale();
  const l = locale as Locale;

  return (
    <section id="programs" className="relative scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={programs.eyebrow} title={programs.title} />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {programs.list.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 120}>
              <div className="border-gold/15 from-panel/70 to-void/40 flex h-full flex-col rounded-[var(--radius-card)] border bg-gradient-to-b p-8">
                <span className="text-gold/40 font-[family-name:var(--font-display)] text-5xl">
                  0{i + 1}
                </span>
                <h3 className="text-cream mt-4 text-xl">{t(p.title, l)}</h3>
                <p className="text-gold-hi mt-3 text-base leading-relaxed">
                  {t(p.punchline, l)}
                </p>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {t(p.detail, l)}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
