// Panchang calculation engine.
//
// Instead of depending on a paid third-party panchang API (every option we
// found is metered/paid past a tiny free tier), we calculate the five limbs
// of the panchang directly from sun & moon positions using the
// `astronomy-engine` library (open-source, no network calls, no cost).
//
// These are standard, well-documented Vedic astronomy formulas:
//   Tithi      = based on the angular distance between Moon and Sun (each
//                tithi = 12° of separation, 30 tithis per lunar month)
//   Nakshatra  = based on Moon's ecliptic longitude (27 nakshatras of 13°20' each)
//   Yoga       = based on the SUM of Sun's and Moon's longitudes
//   Karan      = half of a tithi (60 karans cycle, first 4 fixed, rest repeat)
//   Rahu Kaal / Gulika Kaal / Yamaganda = traditional day-length divisions
//                based on sunrise/sunset and the weekday
//
// Admin can always manually override any day's entry from the admin panel —
// see panchangEntries.isManualOverride in the schema.

import * as Astronomy from "astronomy-engine";

const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
];

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const YOGA_NAMES = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti",
];

const KARAN_NAMES = [
  "Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti",
];
const FIXED_KARAN_NAMES = ["Shakuni", "Chatushpada", "Naga", "Kimstughna"];

function normalizeDegrees(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/**
 * Computes the full panchang for a given date + location.
 * @param {Date} date - the date (UTC-based JS Date at local noon is safest)
 * @param {number} latitude
 * @param {number} longitude
 */
export function calculatePanchang(date, latitude, longitude) {
  const observer = new Astronomy.Observer(latitude, longitude, 0);

  const sunEcl = Astronomy.SunPosition(date);
  const moonEcl = Astronomy.EclipticGeoMoon(date);

  const sunLon = normalizeDegrees(sunEcl.elon);
  const moonLon = normalizeDegrees(moonEcl.lon);

  // Tithi: angular separation Moon - Sun, each tithi spans 12 degrees
  const tithiDiff = normalizeDegrees(moonLon - sunLon);
  const tithiIndex = Math.floor(tithiDiff / 12);
  const paksha = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithi = TITHI_NAMES[tithiIndex];

  // Nakshatra: Moon's longitude, each nakshatra spans 13°20' (13.3333)
  const nakshatraIndex = Math.floor(moonLon / (360 / 27));
  const nakshatra = NAKSHATRA_NAMES[nakshatraIndex];

  // Yoga: sum of sun + moon longitude, each yoga spans 13°20'
  const yogaSum = normalizeDegrees(sunLon + moonLon);
  const yogaIndex = Math.floor(yogaSum / (360 / 27));
  const yoga = YOGA_NAMES[yogaIndex];

  // Karan: half-tithi (each tithi = 2 karans), 60 total in a lunar month
  const karanIndex = Math.floor(tithiDiff / 6);
  let karan;
  if (karanIndex === 0) karan = FIXED_KARAN_NAMES[0]; // Shakuni (special case near end, simplified here)
  else if (karanIndex >= 57) karan = FIXED_KARAN_NAMES[karanIndex - 56] || KARAN_NAMES[(karanIndex - 1) % 7];
  else karan = KARAN_NAMES[(karanIndex - 1 + 7) % 7];

  // Sunrise / sunset
  const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, date, 1);
  const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, date, 1);
  const moonrise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, date, 1);
  const moonset = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, date, 1);

  // Rahu Kaal / Yamaganda / Gulika Kaal: day (sunrise->sunset) split into
  // 8 equal parts; which part is "inauspicious" depends on weekday.
  const dayStart = sunrise ? sunrise.date : date;
  const dayEnd = sunset ? sunset.date : date;
  const dayMs = dayEnd.getTime() - dayStart.getTime();
  const segment = dayMs / 8;

  const weekday = date.getUTCDay(); // 0 = Sunday ... 6 = Saturday

  // Segment index (0-7) for Rahu Kaal by weekday (traditional table)
  const rahuSegmentByDay = [7, 1, 6, 4, 5, 3, 2]; // Sun..Sat -> segment index (1-based slot)
  const gulikaSegmentByDay = [6, 5, 4, 3, 2, 1, 0];
  const yamagandaSegmentByDay = [4, 3, 2, 1, 0, 6, 5];

  function segmentWindow(slot) {
    const start = new Date(dayStart.getTime() + slot * segment);
    const end = new Date(dayStart.getTime() + (slot + 1) * segment);
    return { start, end };
  }

  const rahuKaal = segmentWindow(rahuSegmentByDay[weekday]);
  const gulikaKaal = segmentWindow(gulikaSegmentByDay[weekday]);
  const yamaganda = segmentWindow(yamagandaSegmentByDay[weekday]);

  return {
    tithi,
    paksha,
    nakshatra,
    yoga,
    karan,
    sunrise: sunrise ? sunrise.date : null,
    sunset: sunset ? sunset.date : null,
    moonrise: moonrise ? moonrise.date : null,
    moonset: moonset ? moonset.date : null,
    rahuKaal,
    gulikaKaal,
    yamaganda,
  };
}

// Default location: Latur, Maharashtra (Guruji's location). Update if the
// business location changes.
export const DEFAULT_LOCATION = {
  latitude: 18.4088,
  longitude: 76.5604,
  name: "Latur, Maharashtra",
};
