import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/db/schema.js";
import { eq } from "drizzle-orm";

const starterServices = [
  {
    slug: "vastu-shanti",
    shortDescHi: "घर या कार्यालय से दोषों को दूर करने के लिए सुधारात्मक वास्तु अनुष्ठान।",
    shortDescMr: "घर किंवा कार्यालयातील दोष दूर करण्यासाठी वास्तुशांती विधी.",
  },
  {
    slug: "kalsarp-shanti",
    shortDescHi: "जन्म कुंडली में कालसर्प दोष के लिए निवारण पूजा।",
    shortDescMr: "जन्मपत्रिकेतील कालसर्प दोषासाठी निवारण पूजा.",
  },
  {
    slug: "saptashati-havan",
    shortDescHi: "दुर्गा सप्तशती पाठ के साथ नवचंडी हवन।",
    shortDescMr: "दुर्गा सप्तशती पठण आणि नवचंडी हवन विधी.",
  },
  {
    slug: "janam-kundali",
    shortDescHi: "कंप्यूटर जनित जन्म कुंडली और व्यक्तिगत मार्गदर्शन।",
    shortDescMr: "संगणकीकृत जन्मकुंडली आणि वैयक्तिक मार्गदर्शन.",
  },
  {
    slug: "ratna-suggestion",
    shortDescHi: "आपकी कुंडली के आधार पर प्रमाणित रत्न सुझाव।",
    shortDescMr: "तुमच्या कुंडलीवर आधारित प्रमाणित रत्न सूचन.",
  },
  {
    slug: "reiki-akashic-reading",
    shortDescHi: "ऊर्जा हीलिंग और आकाशिक रिकॉर्ड रीडिंग सत्र।",
    shortDescMr: "ऊर्जा उपचार आणि आकाशिक रेकॉर्ड वाचन सत्र.",
  },
];

async function main() {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) throw new Error("DATABASE_URL is required.");
  
  const client = postgres(DATABASE_URL, { prepare: false });
  const db = drizzle(client, { schema });

  console.log("Updating service descriptions in database...");
  for (const service of starterServices) {
    await db
      .update(schema.services)
      .set({
        shortDescHi: service.shortDescHi,
        shortDescMr: service.shortDescMr,
      })
      .where(eq(schema.services.slug, service.slug));
  }

  console.log("Done updating descriptions.");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
