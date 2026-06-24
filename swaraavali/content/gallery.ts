/**
 * Gallery items. TODO(confirm): replace placeholders with real photos/videos.
 * Until real images are dropped in /public/images, items use a CSS gradient
 * tile (no broken <img>). Set `imageUrl` to swap in a real asset.
 */
export type GalleryItem = {
  id: string;
  title: { en: string; hi: string };
  category: "performance" | "class" | "event" | "instrument";
  imageUrl?: string; // e.g. "/images/recital-2025.jpg"
  videoUrl?: string;
  // Decorative gradient used while no image is set.
  hue: number;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: { en: "Annual recital", hi: "वार्षिक प्रस्तुति" },
    category: "performance",
    hue: 280,
  },
  {
    id: "g2",
    title: { en: "Tabla class", hi: "तबला कक्षा" },
    category: "class",
    hue: 35,
  },
  {
    id: "g3",
    title: { en: "Kathak in motion", hi: "कथक की लय" },
    category: "performance",
    hue: 330,
  },
  {
    id: "g4",
    title: { en: "Swaraavali Mahotsav", hi: "स्वरावली महोत्सव" },
    category: "event",
    hue: 255,
  },
  {
    id: "g5",
    title: { en: "Sitar workshop", hi: "सितार कार्यशाला" },
    category: "class",
    hue: 20,
  },
  {
    id: "g6",
    title: { en: "Vocal ensemble", hi: "सामूहिक गायन" },
    category: "performance",
    hue: 300,
  },
  {
    id: "g7",
    title: { en: "Harmonium close-up", hi: "हारमोनियम" },
    category: "instrument",
    hue: 45,
  },
  {
    id: "g8",
    title: { en: "Summer camp", hi: "ग्रीष्म शिविर" },
    category: "event",
    hue: 265,
  },
];
