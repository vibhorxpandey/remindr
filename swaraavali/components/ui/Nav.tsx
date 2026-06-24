"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";
import { useAudioPreference } from "@/lib/audio";
import { nav, t, type Locale } from "@/content/copy";
import { site } from "@/content/site";

const SECTION_IDS = nav.links.map((l) => l.id);

export function Nav() {
  const { locale, toggle: toggleLocale } = useLocale();
  const { muted, toggle: toggleMuted } = useAudioPreference();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Solidify nav background after scrolling past the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (sections.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "bg-void/85 border-gold/10 border-b backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Link
          href="/#top"
          className="text-cream flex items-baseline gap-2 font-[family-name:var(--font-display)] text-lg"
        >
          <span className="text-gold font-[family-name:var(--font-tiro)]">
            {site.nameDevanagari}
          </span>
          <span className="hidden sm:inline">{site.shortName}</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {nav.links.map((l) => (
            <li key={l.id}>
              <Link
                href={`/#${l.id}`}
                className={`hover:text-gold text-sm transition-colors ${
                  active === l.id ? "text-gold" : "text-muted"
                }`}
                aria-current={active === l.id ? "true" : undefined}
              >
                {t(l, locale as Locale)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ToggleButton
            label={muted ? "Unmute audio" : "Mute audio"}
            onClick={toggleMuted}
          >
            {muted ? "🔇" : "🔊"}
          </ToggleButton>
          <ToggleButton
            label={locale === "en" ? "हिंदी में देखें" : "View in English"}
            onClick={toggleLocale}
          >
            <span className="text-xs font-semibold">
              {locale === "en" ? "हिं" : "EN"}
            </span>
          </ToggleButton>
          <Link
            href="/#contact"
            className="bg-gold text-void hover:bg-gold-hi ml-1 hidden rounded-full px-5 py-2 text-sm font-semibold transition-colors sm:inline-block"
          >
            {t(nav.enroll, locale as Locale)}
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="border-gold/30 text-cream ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-gold/10 bg-void/95 border-t md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-4">
            {nav.links.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="text-cream hover:text-gold block py-3 text-base"
                >
                  {t(l, locale as Locale)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="bg-gold text-void mt-2 inline-block rounded-full px-6 py-3 text-sm font-semibold"
              >
                {t(nav.enroll, locale as Locale)}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function ToggleButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="border-gold/30 text-cream hover:border-gold hover:bg-gold/10 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
    >
      {children}
    </button>
  );
}
