"use client";

import { useLocale } from "@/lib/locale";
import { t, type Locale } from "@/content/copy";
import { Reveal } from "./Reveal";

type Pair = { en: string; hi: string };

/** Eyebrow + title pair used to open each section. */
export function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: Pair;
  title: Pair;
  align?: "left" | "center";
}) {
  const { locale } = useLocale();
  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      <p className="text-gold mb-3 text-sm font-semibold tracking-[0.2em] uppercase">
        {t(eyebrow, locale as Locale)}
      </p>
      <h2 className="text-cream max-w-2xl text-3xl sm:text-4xl md:text-5xl">
        {t(title, locale as Locale)}
      </h2>
    </Reveal>
  );
}
