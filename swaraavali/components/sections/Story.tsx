"use client";

import { useLocale } from "@/lib/locale";
import { story, t, type Locale } from "@/content/copy";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Story() {
  const { locale } = useLocale();
  const l = locale as Locale;

  return (
    <section id="story" className="relative scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={story.eyebrow} title={story.title} />
        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="text-muted text-lg leading-relaxed">{t(story.body, l)}</p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="border-gold/15 bg-gold/10 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border">
              {story.highlights.map((h) => (
                <li key={h.en} className="bg-panel/60 text-cream p-6 text-sm font-medium">
                  <span aria-hidden className="text-gold mb-2 block">
                    ✦
                  </span>
                  {t(h, l)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
