"use client";

import { useLocale } from "@/lib/locale";
import { t, type Locale } from "@/content/copy";
import { events, type EventItem } from "@/content/events";
import { Reveal } from "./Reveal";

function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EventCard({ e, locale }: { e: EventItem; locale: Locale }) {
  const past = new Date(e.startsAt).getTime() < Date.now();
  return (
    <article className="border-gold/15 bg-panel/50 flex flex-col gap-3 rounded-[var(--radius-card)] border p-6 sm:flex-row sm:items-center sm:gap-6">
      <time
        dateTime={e.startsAt}
        className="border-gold/20 bg-void/60 shrink-0 rounded-lg border px-4 py-3 text-center"
      >
        <span className="text-gold block text-2xl font-semibold">
          {new Date(e.startsAt).getDate()}
        </span>
        <span className="text-muted block text-xs tracking-widest uppercase">
          {formatDate(e.startsAt, locale)}
        </span>
      </time>
      <div>
        <div className="flex items-center gap-3">
          <h3 className="text-cream text-xl">{t(e.title, locale)}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              past ? "bg-muted/15 text-muted" : "bg-gold/20 text-gold"
            }`}
          >
            {past
              ? locale === "en"
                ? "Past"
                : "संपन्न"
              : locale === "en"
                ? "Upcoming"
                : "आगामी"}
          </span>
        </div>
        <p className="text-muted mt-1 text-sm">{e.location}</p>
        <p className="text-cream/90 mt-2 text-sm leading-relaxed">
          {t(e.description, locale)}
        </p>
      </div>
    </article>
  );
}

export function EventsList() {
  const { locale } = useLocale();
  const l = locale as Locale;
  const sorted = [...events].sort(
    (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
  );

  return (
    <div className="flex flex-col gap-5">
      {sorted.map((e, i) => (
        <Reveal key={e.id} delay={i * 80}>
          <EventCard e={e} locale={l} />
        </Reveal>
      ))}
    </div>
  );
}
