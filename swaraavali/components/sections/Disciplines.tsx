"use client";

import { useLocale } from "@/lib/locale";
import { disciplines, t, type Locale } from "@/content/copy";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Disciplines() {
  const { locale } = useLocale();
  const l = locale as Locale;

  return (
    <section
      id="disciplines"
      className="bg-panel/30 relative scroll-mt-20 py-24 sm:py-32"
    >
      <Container>
        <SectionHeading eyebrow={disciplines.eyebrow} title={disciplines.title} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {disciplines.list.map((d, i) => (
            <Reveal key={d.id} delay={i * 120}>
              <article className="group border-gold/15 bg-void/60 hover:border-gold/50 relative h-full overflow-hidden rounded-[var(--radius-card)] border p-8 transition-colors">
                {/* Large swara watermark */}
                <span
                  aria-hidden
                  className="text-gold/10 group-hover:text-gold/20 pointer-events-none absolute -top-4 -right-2 font-[family-name:var(--font-tiro)] text-7xl transition-colors"
                >
                  {d.swara}
                </span>
                <div className="text-3xl" aria-hidden>
                  {d.icon}
                </div>
                <h3 className="text-cream mt-4 text-2xl">{t(d.title, l)}</h3>
                <p className="text-gold mt-3 text-base leading-relaxed">
                  {t(d.punchline, l)}
                </p>
                <p className="text-muted mt-4 text-sm leading-relaxed">{t(d.items, l)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
