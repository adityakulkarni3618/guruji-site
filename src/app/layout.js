import "./globals.css";
import { Noto_Serif_Devanagari, Noto_Sans_Devanagari, JetBrains_Mono } from "next/font/google";

// Display face — used with restraint for headings, has the weight of a
// temple inscription rather than a generic web sans.
const displayFont = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

// Body face — same family group so Devanagari and Latin sit together
// cleanly at small sizes (important since MR/HI/EN all render on one page
// template).
const bodyFont = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

// Utility face — for panchang numerals, dates, times: tabular figures make
// the daily panchang card feel like an instrument reading, not prose.
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Sai Shakti Jyotish Kendra | Rahul Chandrakant Joshi-Harangulkar",
  description:
    "Sai Shakti Jyotish Kendra by Rahul Chandrakant Joshi-Harangulkar — Ved, Jyotish, Vastu & Ratnashastra Visharad. Book poojas, vastu consultation, kundali reading, and gemstone guidance. Daily panchang & muhurat.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
