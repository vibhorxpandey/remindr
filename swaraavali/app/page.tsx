import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Disciplines } from "@/components/sections/Disciplines";
import { Programs } from "@/components/sections/Programs";
import { WhyUs } from "@/components/sections/WhyUs";
import { GalleryTeaser } from "@/components/sections/GalleryTeaser";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { coursesJsonLd, jsonLdScript } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      {/* Course structured data — one node per discipline. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(coursesJsonLd()),
        }}
      />
      <a href="#story" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Story />
        <Disciplines />
        <Programs />
        <WhyUs />
        <GalleryTeaser />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
