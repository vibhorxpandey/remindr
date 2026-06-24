/**
 * Typed, bilingual (EN/HI) site copy. Components must read strings from here —
 * never hardcode. HI strings make the site translation-ready; where a Hindi
 * string is intentionally identical (proper nouns) it mirrors the English.
 */

export type Locale = "en" | "hi";

export const LOCALES: Locale[] = ["en", "hi"];

export const nav = {
  links: [
    { id: "story", en: "Story", hi: "परिचय" },
    { id: "disciplines", en: "Disciplines", hi: "विधाएँ" },
    { id: "programs", en: "Programs", hi: "कार्यक्रम" },
    { id: "gallery", en: "Gallery", hi: "गैलरी" },
    { id: "contact", en: "Enroll", hi: "प्रवेश" },
  ],
  enroll: { en: "Enroll now", hi: "अभी प्रवेश लें" },
} as const;

export const hero = {
  // Rotating taglines from the brief.
  taglines: [
    {
      en: "A garland of notes, a lifetime of music.",
      hi: "स्वरों की एक माला, संगीत का एक जीवन।",
    },
    {
      en: "Find your sur. Master your taal. Own the stage.",
      hi: "अपना सुर खोजें। अपनी ताल साधें। मंच जीतें।",
    },
    {
      en: "Where the soul of Bundelkhand learns to sing, play, and dance.",
      hi: "जहाँ बुंदेलखंड की आत्मा गाना, बजाना और नृत्य सीखती है।",
    },
    {
      en: "From your first note to your first standing ovation.",
      hi: "आपके पहले स्वर से पहली तालियों की गूँज तक।",
    },
  ],
  kicker: {
    en: "Music · Dance · Fine Arts · Karvi, Chitrakoot",
    hi: "संगीत · नृत्य · ललित कला · कर्वी, चित्रकूट",
  },
  cta: { en: "Begin your journey", hi: "अपनी यात्रा शुरू करें" },
  secondaryCta: { en: "Explore disciplines", hi: "विधाएँ देखें" },
} as const;

export const story = {
  eyebrow: { en: "Our Story", hi: "हमारी कहानी" },
  title: {
    en: "We don’t just teach music. We pass it on.",
    hi: "हम केवल संगीत नहीं सिखाते। हम इसे आगे बढ़ाते हैं।",
  },
  body: {
    en: "Rooted in the cultural soil of Bundelkhand, Swaraavali is a home for everyone who has ever wanted to sing, play an instrument, or dance. We blend rigorous classical training with the living traditions of folk and light music — practical and theory, taught with patience, for learners of every age.",
    hi: "बुंदेलखंड की सांस्कृतिक माटी में बसी, स्वरावली हर उस व्यक्ति का घर है जिसने कभी गाना, वाद्य बजाना या नृत्य करना चाहा। हम कठोर शास्त्रीय प्रशिक्षण को लोक एवं सुगम संगीत की जीवंत परंपराओं के साथ जोड़ते हैं — व्यावहारिक एवं सैद्धांतिक, हर आयु के शिक्षार्थियों के लिए।",
  },
  highlights: [
    { en: "Practical + Theory curriculum", hi: "व्यावहारिक + सैद्धांतिक पाठ्यक्रम" },
    { en: "100+ student community", hi: "100+ विद्यार्थियों का समुदाय" },
    {
      en: "Offline classes in Karvi, Chitrakoot",
      hi: "कर्वी, चित्रकूट में ऑफलाइन कक्षाएँ",
    },
    { en: "All ages welcome", hi: "हर आयु का स्वागत" },
  ],
} as const;

export type Discipline = {
  id: string;
  icon: string;
  title: { en: string; hi: string };
  punchline: { en: string; hi: string };
  items: { en: string; hi: string };
  swara: string; // Devanagari swara glyph used as a motif
};

export const disciplines = {
  eyebrow: { en: "Disciplines", hi: "विधाएँ" },
  title: { en: "Three paths, one garland", hi: "तीन राहें, एक माला" },
  list: [
    {
      id: "vocal",
      icon: "🎙️",
      swara: "सा",
      title: { en: "Vocal", hi: "गायन" },
      punchline: {
        en: "Classical, folk, and light — find the voice that’s been waiting inside you.",
        hi: "शास्त्रीय, लोक और सुगम — वह आवाज़ खोजें जो भीतर बसी है।",
      },
      items: {
        en: "Hindustani classical · Folk · Light music",
        hi: "हिंदुस्तानी शास्त्रीय · लोक · सुगम संगीत",
      },
    },
    {
      id: "instruments",
      icon: "🎻",
      swara: "ग",
      title: { en: "Instruments", hi: "वाद्य" },
      punchline: {
        en: "From tabla to sitar to piano — pick your sound.",
        hi: "तबले से सितार और पियानो तक — अपनी ध्वनि चुनें।",
      },
      items: {
        en: "Tabla · Dholak · Guitar · Violin · Sitar · Flute · Harmonium · Piano · Octapad",
        hi: "तबला · ढोलक · गिटार · वायलिन · सितार · बाँसुरी · हारमोनियम · पियानो · ऑक्टापैड",
      },
    },
    {
      id: "dance",
      icon: "💃",
      swara: "नि",
      title: { en: "Dance", hi: "नृत्य" },
      punchline: {
        en: "Kathak’s grace meets Bundelkhand’s fire.",
        hi: "कथक की गरिमा, बुंदेलखंड की आग।",
      },
      items: {
        en: "Kathak · Bundelkhand folk dance (Bundelkhand nritya)",
        hi: "कथक · बुंदेलखंड लोक नृत्य (बुंदेलखंड नृत्य)",
      },
    },
  ] as Discipline[],
} as const;

export const instrumentsList = [
  "Tabla",
  "Dholak",
  "Guitar",
  "Violin",
  "Sitar",
  "Flute",
  "Harmonium",
  "Piano",
  "Octapad",
] as const;

export const programs = {
  eyebrow: { en: "Programs", hi: "कार्यक्रम" },
  title: {
    en: "More than lessons — a stage for life",
    hi: "केवल पाठ नहीं — जीवन भर का मंच",
  },
  list: [
    {
      id: "competition",
      title: { en: "Annual Competition", hi: "वार्षिक प्रतियोगिता" },
      punchline: {
        en: "Compete, perform, and take home more than a certificate.",
        hi: "प्रतिस्पर्धा करें, प्रस्तुति दें और प्रमाणपत्र से बढ़कर कुछ ले जाएँ।",
      },
      detail: {
        en: "Certificates and goodies for our rising stars across every discipline.",
        hi: "हर विधा के उभरते सितारों के लिए प्रमाणपत्र और उपहार।",
      },
    },
    {
      id: "mahotsav",
      title: { en: "Swaraavali Mahotsav", hi: "स्वरावली महोत्सव" },
      punchline: {
        en: "Our annual festival — where students share the stage with celebrated guests.",
        hi: "हमारा वार्षिक महोत्सव — जहाँ विद्यार्थी प्रतिष्ठित अतिथियों के साथ मंच साझा करते हैं।",
      },
      detail: {
        en: "An evening of music and dance with prime guests of honour.",
        hi: "संगीत और नृत्य की एक संध्या, विशिष्ट अतिथियों के साथ।",
      },
    },
    {
      id: "summer",
      title: { en: "Summer Camps & Workshops", hi: "ग्रीष्म शिविर एवं कार्यशालाएँ" },
      punchline: {
        en: "Intensive, hands-on, offline sessions to fast-track your craft.",
        hi: "गहन, व्यावहारिक, ऑफलाइन सत्र — अपनी कला को तेज़ी से निखारें।",
      },
      detail: {
        en: "Seasonal offline camps and focused workshops for all levels.",
        hi: "मौसमी ऑफलाइन शिविर और हर स्तर के लिए केंद्रित कार्यशालाएँ।",
      },
    },
  ],
} as const;

export const whyUs = {
  eyebrow: { en: "Why Swaraavali", hi: "स्वरावली ही क्यों" },
  title: { en: "Where tradition meets the stage", hi: "जहाँ परंपरा मंच से मिलती है" },
  reasons: [
    {
      title: { en: "Practical + Theory", hi: "व्यावहारिक + सैद्धांतिक" },
      body: {
        en: "A balanced curriculum so you don’t just perform — you understand.",
        hi: "संतुलित पाठ्यक्रम ताकि आप केवल प्रस्तुति न दें — समझें भी।",
      },
    },
    {
      title: { en: "Stage from day one", hi: "पहले दिन से मंच" },
      body: {
        en: "Competitions, the Mahotsav, and workshops give every student a real audience.",
        hi: "प्रतियोगिताएँ, महोत्सव और कार्यशालाएँ हर विद्यार्थी को सच्चा दर्शक देती हैं।",
      },
    },
    {
      title: { en: "Rooted in Bundelkhand", hi: "बुंदेलखंड में निहित" },
      body: {
        en: "We carry our region’s folk traditions alongside Hindustani classical music.",
        hi: "हम हिंदुस्तानी शास्त्रीय संगीत के साथ अपने क्षेत्र की लोक परंपराओं को संजोते हैं।",
      },
    },
    {
      title: { en: "A 100+ strong community", hi: "100+ का सशक्त समुदाय" },
      body: {
        en: "Learn beside a growing family of musicians and dancers.",
        hi: "संगीतकारों और नर्तकों के बढ़ते परिवार के साथ सीखें।",
      },
    },
  ],
} as const;

export const testimonials = {
  eyebrow: { en: "Voices", hi: "अनुभव" },
  title: { en: "From our students", hi: "हमारे विद्यार्थियों से" },
  // TODO(confirm): placeholder testimonials — swap with real quotes + names.
  items: [
    {
      author: "Ananya Tripathi",
      role: { en: "Vocal student", hi: "गायन विद्यार्थी" },
      quote: {
        en: "I came shy and could barely hold a note. My first Mahotsav performance changed my life.",
        hi: "मैं संकोची थी और मुश्किल से स्वर साध पाती थी। पहले महोत्सव की प्रस्तुति ने मेरा जीवन बदल दिया।",
      },
    },
    {
      author: "Rohan Dwivedi",
      role: { en: "Tabla student", hi: "तबला विद्यार्थी" },
      quote: {
        en: "The teachers care about the why, not just the how. My taal finally makes sense.",
        hi: "शिक्षक केवल 'कैसे' नहीं, 'क्यों' की भी परवाह करते हैं। अब मेरी ताल समझ आती है।",
      },
    },
    {
      author: "Megha Sahu",
      role: { en: "Kathak student", hi: "कथक विद्यार्थी" },
      quote: {
        en: "Kathak here is pure grace and fire at once. I never want to leave the floor.",
        hi: "यहाँ कथक एक साथ शुद्ध गरिमा और आग है। मन करता है मंच कभी न छोड़ूँ।",
      },
    },
  ],
} as const;

export const contact = {
  eyebrow: { en: "Enroll", hi: "प्रवेश" },
  title: { en: "Start your first note here", hi: "अपना पहला स्वर यहीं से शुरू करें" },
  subtitle: {
    en: "Tell us what you’d love to learn. We’ll reach out about batches and the next steps.",
    hi: "बताइए आप क्या सीखना चाहेंगे। हम बैच और अगले चरणों के बारे में संपर्क करेंगे।",
  },
  form: {
    name: { en: "Full name", hi: "पूरा नाम" },
    phone: { en: "Phone number", hi: "फ़ोन नंबर" },
    email: { en: "Email", hi: "ईमेल" },
    discipline: { en: "Discipline", hi: "विधा" },
    instrument: { en: "Instrument", hi: "वाद्य" },
    batch: { en: "Preferred batch", hi: "पसंदीदा बैच" },
    message: { en: "Anything else?", hi: "और कुछ?" },
    consent: {
      en: "I agree to be contacted about enrollment at Swaraavali.",
      hi: "मैं स्वरावली में प्रवेश के संबंध में संपर्क किए जाने हेतु सहमत हूँ।",
    },
    submit: { en: "Send enquiry", hi: "पूछताछ भेजें" },
    submitting: { en: "Sending…", hi: "भेज रहे हैं…" },
    successTitle: {
      en: "Thank you — your note reached us 🎵",
      hi: "धन्यवाद — आपका संदेश हमें मिल गया 🎵",
    },
    successBody: {
      en: "We’ll be in touch shortly. Meanwhile, feel free to call or WhatsApp us.",
      hi: "हम शीघ्र संपर्क करेंगे। तब तक कॉल या व्हाट्सऐप करें।",
    },
    errorGeneric: {
      en: "Something went wrong. Please try again, or call us directly.",
      hi: "कुछ गड़बड़ हो गई। कृपया पुनः प्रयास करें, या सीधे कॉल करें।",
    },
  },
} as const;

export const footer = {
  punchline: {
    en: "Every great musician started with a single note. Start yours here.",
    hi: "हर महान संगीतकार ने एक स्वर से शुरुआत की। अपनी शुरुआत यहीं करें।",
  },
  rights: { en: "All rights reserved.", hi: "सर्वाधिकार सुरक्षित।" },
} as const;

/** Pick the right language from a bilingual string pair. */
export function t(pair: { en: string; hi: string }, locale: Locale): string {
  return pair[locale];
}
