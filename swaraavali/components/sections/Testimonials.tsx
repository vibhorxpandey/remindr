"use client";

import { useLocale } from "@/lib/locale";
import { testimonials, t, type Locale } from "@/content/copy";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials() {
  const { locale } = useLocale();
  const l = locale as Locale;

  return (
    <section className="relative scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={testimonials.eyebrow} title={testimonials.title} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((item, i) => (
            <Reveal key={item.author} delay={i * 120}>
              <figure className="border-gold/15 bg-panel/50 flex h-full flex-col rounded-[var(--radius-card)] border p-8">
                <span aria-hidden className="text-gold/50 text-4xl">
                  &ldquo;
                </span>
                <blockquote className="text-cream mt-2 flex-1 text-base leading-relaxed">
                  {t(item.quote, l)}
                </blockquote>
                <figcaption className="border-gold/15 mt-6 border-t pt-4 text-sm">
                  <span className="text-gold font-semibold">{item.author}</span>
                  <span className="text-muted block">{t(item.role, l)}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
