"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t, type Locale } from "@/content/copy";
import { galleryItems, type GalleryItem } from "@/content/gallery";
import { GalleryTile } from "./GalleryTile";

/**
 * Full gallery with an accessible lightbox. Keyboard: Esc closes, ←/→ navigate.
 * Focus returns to the trigger on close. Placeholder tiles render a gradient
 * until real images are dropped into /public/images and wired in gallery.ts.
 */
export function GalleryGrid() {
  const { locale } = useLocale();
  const l = locale as Locale;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i + 1) % galleryItems.length)),
    []
  );
  const prev = useCallback(
    () =>
      setOpenIdx((i) =>
        i === null ? i : (i - 1 + galleryItems.length) % galleryItems.length
      ),
    []
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx, close, next, prev]);

  const active: GalleryItem | null = openIdx === null ? null : galleryItems[openIdx]!;

  return (
    <>
      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {galleryItems.map((item, i) => (
          <div key={item.id} className="break-inside-avoid">
            <GalleryTile item={item} locale={l} onClick={() => setOpenIdx(i)} />
          </div>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(active.title, l)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white hover:bg-white/10"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous"
            className="absolute left-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white hover:bg-white/10"
          >
            ‹
          </button>
          <figure
            className="relative aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-[var(--radius-card)]"
            onClick={(e) => e.stopPropagation()}
            style={
              active.imageUrl
                ? undefined
                : {
                    background: `linear-gradient(135deg, hsl(${active.hue} 52% 55%), hsl(${active.hue + 25} 48% 36%))`,
                  }
            }
          >
            {active.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.imageUrl}
                alt={t(active.title, l)}
                className="h-full w-full object-contain"
              />
            )}
            <figcaption className="absolute right-0 bottom-0 left-0 bg-black/60 p-4 text-center text-white">
              {t(active.title, l)}
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next"
            className="border-gold/40 text-cream hover:bg-gold/10 absolute right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
