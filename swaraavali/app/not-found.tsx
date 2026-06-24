import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center">
      <Container className="text-center">
        <p className="text-gold font-[family-name:var(--font-tiro)] text-6xl">सा</p>
        <h1 className="text-cream mt-4 text-3xl">This note isn’t in our garland</h1>
        <p className="text-muted mt-3">The page you’re looking for can’t be found.</p>
        <Link
          href="/"
          className="bg-gold text-void hover:bg-gold-hi mt-8 inline-block rounded-full px-7 py-3 font-semibold"
        >
          Back home
        </Link>
      </Container>
    </main>
  );
}
