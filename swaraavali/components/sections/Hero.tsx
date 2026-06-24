"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";
import { useAudioPreference } from "@/lib/audio";
import { hero, t, type Locale } from "@/content/copy";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

// The swara garland — Devanagari note names. Reused as the 3D particle set later.
const SWARAS = ["सा", "रे", "ग", "म", "प", "ध", "नि", "सां"];

/**
 * Static hero "poster". This is the zero-WebGL baseline — a designed indigo
 * gradient, an animated gold sheen, and a decorative CSS garland of swara
 * glyphs. Phase 3 mounts the <Canvas> on capable devices in front of this,
 * but the poster always renders so the page works without WebGL.
 */
export function Hero() {
  const { locale } = useLocale();
  const { muted, setMuted } = useAudioPreference();
  const l = locale as Locale;
  const [idx, setIdx] = useState(0);

  // Rotate taglines (paused under reduced-motion).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % hero.taglines.length),
      4500
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="grain relative flex min-h-[92vh] items-center overflow-hidden"
    >
      {/* Designed gradient backdrop (the poster). */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, #fbeed4 0%, #fcf6ea 45%, #ffffff 100%)",
        }}
      />
      {/* Volumetric gold glow + animated sheen. */}
      <div
        aria-hidden
        className="sheen pointer-events-none absolute inset-0 -z-10 opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(224,160,48,0.22) 0%, transparent 70%)",
        }}
      />

      {/* Decorative garland of swara glyphs. */}
      <ul aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {SWARAS.map((s, i) => (
          <li
            key={s}
            className="text-gold/30 swara-float absolute font-[family-name:var(--font-tiro)]"
            style={{
              left: `${8 + i * 11}%`,
              top: `${20 + (i % 4) * 16}%`,
              fontSize: `${1.4 + (i % 3) * 0.7}rem`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            {s}
          </li>
        ))}
      </ul>

      <Container className="relative">
        <p className="text-gold mb-5 text-sm font-semibold tracking-[0.25em] uppercase">
          {t(hero.kicker, l)}
        </p>

        <h1 className="text-cream max-w-4xl text-4xl leading-[1.05] text-balance sm:text-6xl md:text-7xl">
          <span className="gold-gradient">{site.nameDevanagari}</span>
          <span className="text-cream/90 mt-3 block text-2xl sm:text-3xl md:text-4xl">
            {t(hero.taglines[idx] ?? hero.taglines[0]!, l)}
          </span>
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/#contact">{t(hero.cta, l)}</Button>
          <Button href="/#disciplines" variant="ghost">
            {t(hero.secondaryCta, l)}
          </Button>

          {/* "Tune in" audio affordance — default muted, never autoplays. */}
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            className="text-muted hover:text-gold inline-flex items-center gap-2 text-sm transition-colors"
            aria-pressed={!muted}
          >
            <span aria-hidden>{muted ? "🔊" : "🔇"}</span>
            {muted
              ? l === "en"
                ? "Tune in (tanpura)"
                : "सुनें (तानपूरा)"
              : l === "en"
                ? "Mute"
                : "मौन"}
          </button>
        </div>

        <p className="text-muted mt-12 max-w-md text-sm leading-relaxed">
          {site.description}
        </p>
      </Container>

      <style jsx>{`
        @keyframes swara-float {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.25;
          }
          50% {
            transform: translateY(-18px);
            opacity: 0.5;
          }
        }
        .swara-float {
          animation: swara-float 7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .swara-float {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
