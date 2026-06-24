"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";
import type { Locale } from "@/content/copy";
import { galleryItems } from "@/content/gallery";
import { GalleryTile } from "@/components/ui/GalleryTile";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function GalleryTeaser() {
  const { locale } = useLocale();
  const l = locale as Locale;
  const teaser = galleryItems.slice(0, 6);

  return (
    <section id="gallery" className="relative scroll-mt-20 py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={{ en: "Gallery", hi: "गैलरी" }}
            title={{ en: "Moments from the floor", hi: "मंच के कुछ पल" }}
          />
          <Link
            href="/gallery"
            className="text-gold hover:text-maroon text-sm font-semibold"
          >
            {l === "en" ? "View full gallery →" : "पूरी गैलरी देखें →"}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {teaser.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <GalleryTile item={item} locale={l} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
