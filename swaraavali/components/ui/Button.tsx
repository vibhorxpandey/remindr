"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-hi)]";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-void hover:bg-gold-hi shadow-[0_0_30px_-8px_var(--color-gold)]",
  ghost: "border border-gold/40 text-cream hover:border-gold hover:bg-gold/10",
};

/**
 * Magnetic button: nudges toward the cursor on desktop (pointer: fine),
 * disabled for reduced-motion / touch. Renders as a Link or <button>.
 */
export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  }
  function reset() {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }

  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link
        ref={ref}
        href={href}
        className={cls}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ transition: "transform 0.2s ease, background-color 0.3s ease" }}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${cls} disabled:cursor-not-allowed disabled:opacity-60`}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transition: "transform 0.2s ease, background-color 0.3s ease" }}
    >
      {children}
    </button>
  );
}
