import type { Metadata } from "next";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { Container } from "@/components/ui/Container";
import { EventsList } from "@/components/ui/EventsList";
import { events } from "@/content/events";
import { eventJsonLd, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Events — Mahotsav, Competitions & Workshops",
  description:
    "Upcoming and past events at Swaraavali Institute of Music & Fine Arts in Karvi, Chitrakoot — the Swaraavali Mahotsav, annual competitions, and summer workshops.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  // One Event JSON-LD node per event for rich results.
  const jsonLd = events.map((e) =>
    eventJsonLd({
      title: e.title.en,
      description: e.description.en,
      startsAt: e.startsAt,
      endsAt: e.endsAt,
      location: e.location,
    })
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <Nav />
      <main id="main" className="pt-28">
        <Container>
          <p className="text-gold text-sm font-semibold tracking-[0.2em] uppercase">
            Events
          </p>
          <h1 className="text-cream mt-3 text-4xl sm:text-5xl">
            Where students take the stage
          </h1>
          <p className="text-muted mt-4 max-w-xl">
            Our festival nights, competitions, and workshops — open to the whole
            community.
          </p>
          <div className="mt-12 pb-24">
            <EventsList />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
