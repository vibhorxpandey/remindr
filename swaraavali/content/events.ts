/**
 * Events. TODO(confirm): replace with real dates/details. Dates are ISO so
 * they flow straight into Event JSON-LD. `isFeatured` items show on the home
 * teaser; all show on /events.
 */
export type EventItem = {
  id: string;
  slug: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  startsAt: string; // ISO
  endsAt?: string;
  location: string;
  isFeatured: boolean;
};

export const events: EventItem[] = [
  {
    id: "e1",
    slug: "swaraavali-mahotsav-2026",
    title: { en: "Swaraavali Mahotsav 2026", hi: "स्वरावली महोत्सव 2026" },
    description: {
      en: "Our flagship annual festival — students share the stage with celebrated guest artists across music and dance.",
      hi: "हमारा प्रमुख वार्षिक महोत्सव — विद्यार्थी संगीत और नृत्य के प्रतिष्ठित अतिथि कलाकारों के साथ मंच साझा करते हैं।",
    },
    startsAt: "2026-11-15T17:00:00+05:30",
    location: "Karvi, Chitrakoot",
    isFeatured: true,
  },
  {
    id: "e2",
    slug: "annual-competition-2026",
    title: { en: "Annual Competition 2026", hi: "वार्षिक प्रतियोगिता 2026" },
    description: {
      en: "Compete across vocal, instrument, and dance categories. Certificates and goodies for our rising stars.",
      hi: "गायन, वाद्य और नृत्य श्रेणियों में प्रतिस्पर्धा करें। उभरते सितारों के लिए प्रमाणपत्र और उपहार।",
    },
    startsAt: "2026-09-20T10:00:00+05:30",
    location: "Karvi, Chitrakoot",
    isFeatured: true,
  },
  {
    id: "e3",
    slug: "summer-camp-2026",
    title: {
      en: "Summer Camp & Workshops 2026",
      hi: "ग्रीष्म शिविर एवं कार्यशालाएँ 2026",
    },
    description: {
      en: "Intensive offline sessions for beginners and improvers across every discipline.",
      hi: "हर विधा में शुरुआती और उन्नत शिक्षार्थियों के लिए गहन ऑफलाइन सत्र।",
    },
    startsAt: "2026-05-10T09:00:00+05:30",
    endsAt: "2026-06-10T13:00:00+05:30",
    location: "Karvi, Chitrakoot",
    isFeatured: false,
  },
];
