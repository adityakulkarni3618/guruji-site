// Run with: node scripts/seed.js
// Requires DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME in your environment.

import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import bcrypt from "bcryptjs";
import * as schema from "../src/db/schema.js";

async function main() {
  const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

  if (!DATABASE_URL) throw new Error("DATABASE_URL is required. Add it to .env.local first.");
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to create the first login.");
  }

  const client = postgres(DATABASE_URL, { prepare: false });
  const db = drizzle(client, { schema });

  console.log("Creating first admin user...");
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await db
    .insert(schema.adminUsers)
    .values({
      name: ADMIN_NAME || "Guruji Rahul Joshi",
      email: ADMIN_EMAIL,
      passwordHash,
      role: "owner",
    })
    .onConflictDoNothing();

  console.log("Seeding starter services from visiting card...");
  const starterServices = [
    {
      slug: "vastu-shanti",
      category: "vastu",
      nameEn: "Vastu Shanti",
      nameHi: "वास्तु शांति",
      nameMr: "वास्तु शांती",
      shortDescEn: "Remedial vastu ritual to remove doshas from home or office.",
      shortDescHi: "घर या कार्यालय से दोषों को दूर करने के लिए सुधारात्मक वास्तु अनुष्ठान।",
      shortDescMr: "घर किंवा कार्यालयातील दोष दूर करण्यासाठी वास्तुशांती विधी.",
      isActive: true,
    },
    {
      slug: "kalsarp-shanti",
      category: "pooja",
      nameEn: "Kalsarp Shanti",
      nameHi: "कालसर्प शांति",
      nameMr: "कालसर्प शांती",
      shortDescEn: "Remedial pooja for Kalsarp dosha in the birth chart.",
      shortDescHi: "जन्म कुंडली में कालसर्प दोष के लिए निवारण पूजा।",
      shortDescMr: "जन्मपत्रिकेतील कालसर्प दोषासाठी निवारण पूजा.",
      isActive: true,
    },
    {
      slug: "saptashati-havan",
      category: "pooja",
      nameEn: "Saptashati Path Havan (Navchandi)",
      nameHi: "सप्तशती पाठ हवन (नवचंडी)",
      nameMr: "सप्तशती पाठ हवन (नवचंडी)",
      shortDescEn: "Navchandi havan with Durga Saptashati recitation.",
      shortDescHi: "दुर्गा सप्तशती पाठ के साथ नवचंडी हवन।",
      shortDescMr: "दुर्गा सप्तशती पठण आणि नवचंडी हवन विधी.",
      isActive: true,
    },
    {
      slug: "janam-kundali",
      category: "jyotish",
      nameEn: "Janam Kundali & Guidance",
      nameHi: "जन्म कुंडली एवं मार्गदर्शन",
      nameMr: "जन्मकुंडली व मार्गदर्शन",
      shortDescEn: "Computer-generated birth chart with personal guidance.",
      shortDescHi: "कंप्यूटर जनित जन्म कुंडली और व्यक्तिगत मार्गदर्शन।",
      shortDescMr: "संगणकीकृत जन्मकुंडली आणि वैयक्तिक मार्गदर्शन.",
      isActive: true,
    },
    {
      slug: "ratna-suggestion",
      category: "gemstone",
      nameEn: "Gemstone (Ratna) Suggestion",
      nameHi: "रत्न सुझाव",
      nameMr: "रत्न सूचन",
      shortDescEn: "Certified gemstone recommendation based on your kundali.",
      shortDescHi: "आपकी कुंडली के आधार पर प्रमाणित रत्न सुझाव।",
      shortDescMr: "तुमच्या कुंडलीवर आधारित प्रमाणित रत्न सूचन.",
      isActive: true,
    },
    {
      slug: "reiki-akashic-reading",
      category: "reiki",
      nameEn: "Reiki & Akashic Record Reading",
      nameHi: "रेकी एवं आकाशिक रिकॉर्ड रीडिंग",
      nameMr: "रेकी व आकाशिक रेकॉर्ड रीडिंग",
      shortDescEn: "Energy healing and akashic record reading sessions.",
      shortDescHi: "ऊर्जा हीलिंग और आकाशिक रिकॉर्ड रीडिंग सत्र।",
      shortDescMr: "ऊर्जा उपचार आणि आकाशिक रेकॉर्ड वाचन सत्र.",
      isActive: true,
    },
  ];

  for (const service of starterServices) {
    await db.insert(schema.services).values(service).onConflictDoNothing();
  }

  console.log("Done. Log in at /admin/login with:", ADMIN_EMAIL);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
