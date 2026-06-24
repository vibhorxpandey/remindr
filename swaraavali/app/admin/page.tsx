import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Admin",
  description: "Swaraavali enquiries dashboard.",
  robots: { index: false, follow: false },
};

/**
 * Admin placeholder. Phase 2 replaces this with Supabase-Auth-gated access:
 * enquiries table (filter by status/discipline/date), detail view, status
 * updates, and CSV export. Kept non-indexable now.
 */
export default function AdminPage() {
  return (
    <main id="main" className="flex min-h-screen items-center">
      <Container className="text-center">
        <p className="text-gold text-sm font-semibold tracking-[0.2em] uppercase">
          Admin
        </p>
        <h1 className="text-cream mt-3 text-3xl">Enquiries dashboard</h1>
        <p className="text-muted mx-auto mt-4 max-w-md">
          This protected dashboard is built in Phase 2 (Supabase Auth + enquiries table,
          filters, status updates, and CSV export).
        </p>
      </Container>
    </main>
  );
}
