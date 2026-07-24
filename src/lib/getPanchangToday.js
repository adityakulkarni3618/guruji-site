import { calculatePanchang, DEFAULT_LOCATION } from "./panchang";

function fmtTime(date) {
  if (!date) return "--:--";
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Returns today's panchang. Checks the database first (in case admin has
 * manually overridden today's entry); otherwise calculates it live via
 * astronomy-engine. Designed to degrade gracefully — if DATABASE_URL isn't
 * configured yet (e.g. during initial setup), it still returns a correct
 * live-calculated panchang instead of crashing the homepage.
 */
export async function getPanchangToday() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  try {
    const { db } = await import("@/db");
    const { panchangEntries } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const rows = await db
      .select()
      .from(panchangEntries)
      .where(eq(panchangEntries.entryDate, todayStr))
      .limit(1);

    if (rows[0]) {
      const r = rows[0];
      return {
        date: todayStr,
        tithi: r.tithi,
        paksha: r.paksha,
        nakshatra: r.nakshatra,
        yoga: r.yoga,
        karan: r.karan,
        sunrise: r.sunrise,
        sunset: r.sunset,
        rahuKaal: r.rahuKaalStart && r.rahuKaalEnd ? `${r.rahuKaalStart} – ${r.rahuKaalEnd}` : null,
        gulikaKaal: r.gulikaKaalStart && r.gulikaKaalEnd ? `${r.gulikaKaalStart} – ${r.gulikaKaalEnd}` : null,
        source: "manual",
      };
    }
  } catch (err) {
    // DB not reachable/configured yet — fall through to live calculation.
  }

  const computed = calculatePanchang(today, DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
  return {
    date: todayStr,
    tithi: computed.tithi,
    paksha: computed.paksha,
    nakshatra: computed.nakshatra,
    yoga: computed.yoga,
    karan: computed.karan,
    sunrise: fmtTime(computed.sunrise),
    sunset: fmtTime(computed.sunset),
    rahuKaal: `${fmtTime(computed.rahuKaal.start)} – ${fmtTime(computed.rahuKaal.end)}`,
    gulikaKaal: `${fmtTime(computed.gulikaKaal.start)} – ${fmtTime(computed.gulikaKaal.end)}`,
    source: "calculated",
  };
}
