import Image from "next/image";
import { t, type Locale } from "@/content/copy";
import type { GalleryItem } from "@/content/gallery";

/**
 * A single gallery tile. Renders a real optimized image if `imageUrl` is set;
 * otherwise a branded gradient placeholder (no broken images before assets
 * are added). `onClick` opens the lightbox on the full gallery page.
 */
export function GalleryTile({
  item,
  locale,
  onClick,
  priority = false,
}: {
  item: GalleryItem;
  locale: Locale;
  onClick?: () => void;
  priority?: boolean;
}) {
  const label = t(item.title, locale);
  const inner = (
    <>
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={label}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, hsl(${item.hue} 45% 22%), hsl(${item.hue + 25} 40% 12%))`,
          }}
        />
      )}
      <div className="from-void/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
      <span className="text-cream absolute right-3 bottom-3 left-3 text-sm font-medium">
        {label}
      </span>
    </>
  );

  const cls =
    "group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-gold/15";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${cls} w-full text-left`}>
        {inner}
      </button>
    );
  }
  return <div className={cls}>{inner}</div>;
}
