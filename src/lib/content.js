// Each function tries the real database first; if DATABASE_URL isn't set up
// yet (fresh clone, local dev before Supabase is connected) it falls back to
// seed content derived from Guruji's visiting cards, so the site is never
// blank during setup/demo.

const SEED_SERVICES = [
  {
    id: "seed-1",
    slug: "vastu-shanti",
    category: "vastu",
    nameEn: "Vastu Shanti",
    nameHi: "वास्तु शांति",
    nameMr: "वास्तु शांती",
    shortDescEn: "Remedial vastu ritual to remove doshas from home or office.",
    priceNote: null,
  },
  {
    id: "seed-2",
    slug: "kalsarp-shanti",
    category: "pooja",
    nameEn: "Kalsarp Shanti",
    nameHi: "कालसर्प शांति",
    nameMr: "कालसर्प शांती",
    shortDescEn: "Remedial pooja for Kalsarp dosha in the birth chart.",
    priceNote: null,
  },
  {
    id: "seed-3",
    slug: "saptashati-havan",
    category: "pooja",
    nameEn: "Saptashati Path Havan (Navchandi)",
    nameHi: "सप्तशती पाठ हवन (नवचंडी)",
    nameMr: "सप्तशती पाठ हवन (नवचंडी)",
    shortDescEn: "Navchandi havan with Durga Saptashati recitation.",
    priceNote: null,
  },
  {
    id: "seed-4",
    slug: "janam-kundali",
    category: "jyotish",
    nameEn: "Janam Kundali & Guidance",
    nameHi: "जन्म कुंडली एवं मार्गदर्शन",
    nameMr: "जन्मकुंडली व मार्गदर्शन",
    shortDescEn: "Computer-generated birth chart with personal guidance.",
    priceNote: null,
  },
  {
    id: "seed-5",
    slug: "ratna-suggestion",
    category: "gemstone",
    nameEn: "Gemstone (Ratna) Suggestion",
    nameHi: "रत्न सुझाव",
    nameMr: "रत्न सूचन",
    shortDescEn: "Certified gemstone recommendation based on your kundali.",
    priceNote: null,
  },
  {
    id: "seed-6",
    slug: "reiki-akashic-reading",
    category: "reiki",
    nameEn: "Reiki & Akashic Record Reading",
    nameHi: "रेकी एवं आकाशिक रिकॉर्ड रीडिंग",
    nameMr: "रेकी व आकाशिक रेकॉर्ड रीडिंग",
    shortDescEn: "Energy healing and akashic record reading sessions.",
    priceNote: null,
  },
];

export async function getServices({ category } = {}) {
  try {
    const { db } = await import("@/db");
    const { services } = await import("@/db/schema");
    const { eq, and } = await import("drizzle-orm");

    const rows = await db.select().from(services);
    const active = rows.filter((s) => s.isActive);
    return category ? active.filter((s) => s.category === category) : active;
  } catch {
    return category ? SEED_SERVICES.filter((s) => s.category === category) : SEED_SERVICES;
  }
}

export async function getServiceBySlug(slug) {
  try {
    const { db } = await import("@/db");
    const { services } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const rows = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
    return rows[0] || null;
  } catch {
    return SEED_SERVICES.find((s) => s.slug === slug) || null;
  }
}

export async function getTestimonials() {
  try {
    const { db } = await import("@/db");
    const { testimonials } = await import("@/db/schema");
    const rows = await db.select().from(testimonials);
    return rows.filter((t) => t.isApproved);
  } catch {
    return [
      {
        id: "seed-t1",
        customerName: "Devotee, Latur",
        textEn: "Guruji's vastu guidance brought real peace to our new home.",
        textHi: "गुरुजी के वास्तु मार्गदर्शन से हमारे नए घर में सच्ची शांति आई।",
        textMr: "गुरुजींच्या वास्तु मार्गदर्शनामुळे आमच्या नव्या घरात खरी शांती आली.",
        rating: 5,
      },
    ];
  }
}

export function pickLang(obj, field, locale) {
  const key =
    locale === "en" ? `${field}En` : locale === "hi" ? `${field}Hi` : `${field}Mr`;
  return obj[key] || obj[`${field}En`] || "";
}
