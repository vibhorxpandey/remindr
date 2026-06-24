import type { Metadata } from "next";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { Container } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/ui/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery — Performances, Classes & Events",
  description:
    "Photos and moments from Swaraavali Institute of Music & Fine Arts — recitals, classes, the Swaraavali Mahotsav, and workshops in Karvi, Chitrakoot.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <Nav />
      <main id="main" className="pt-28">
        <Container>
          <p className="text-gold text-sm font-semibold tracking-[0.2em] uppercase">
            Gallery
          </p>
          <h1 className="text-cream mt-3 text-4xl sm:text-5xl">Moments from the floor</h1>
          <p className="text-muted mt-4 max-w-xl">
            A glimpse of life at Swaraavali — performances, classes, and festival nights.
          </p>
          <div className="mt-12 pb-24">
            <GalleryGrid />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
