import type { Metadata } from "next";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Enroll & Contact — Music, Dance Classes in Karvi",
  description:
    "Enroll at Swaraavali Institute of Music & Fine Arts in Karvi, Chitrakoot. Enquire about vocal, instrument, and dance classes. Call, WhatsApp, or send an enquiry.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main id="main" className="pt-16">
        <Contact />
      </main>
      <Footer />
    </>
  );
}
