import { getDictionary } from "@/i18n/dictionaries";

const aboutContent = {
  en: {
    bio: [
      "Guruji Rahul Chandrakant Joshi-Harangulkar is a Ved, Jyotish, Vastu & Ratnashastra Visharad and a devoted Shri Vidya Upasak, based in Latur, Maharashtra. With deep grounding in traditional Vedic scripture and years of guiding families through life's important decisions, Guruji offers a rare combination of ritual precision and personal, compassionate guidance.",
      "Guruji's practice spans birth-chart (Kundali) analysis, Vastu correction for homes and businesses, gemstone (Ratna) recommendation, and the performance of Poojas and Havans for remedies, celebrations, and life milestones — including Vastu Shanti, Kalsarp Shanti, Saptashati Path Havan (Navchandi), Vivah, and Upanayan ceremonies.",
      "Beyond traditional Jyotish, Guruji also offers Akashic Record Reading and Reiki healing, bringing together classical astrology with holistic wellbeing practices for those seeking guidance beyond the conventional.",
    ],
    credentials: [
      "Ved & Jyotish Visharad",
      "Vastu Shastra Consultant",
      "Ratnashastra (Gemology) Specialist",
      "Shri Vidya Upasak",
    ],
  },
  mr: {
    bio: [
      "राहुल चंद्रकांत जोशी-हारंगुळकर हे लातूर, महाराष्ट्र येथे स्थित वेद, ज्योतिष, वास्तू व रत्नशास्त्र विशारद आणि श्री विद्या उपासक आहेत. वैदिक शास्त्राचा सखोल अभ्यास आणि अनेक वर्षांपासून कुटुंबांना जीवनातील महत्त्वाच्या निर्णयांमध्ये मार्गदर्शन केल्याने, गुरुजी विधी अचूकता आणि वैयक्तिक, करुणामयी मार्गदर्शनाचा दुर्लभ संगम देतात.",
      "गुरुजींची सेवा जन्मपत्रिका (कुंडली) विश्लेषण, घर व व्यापाराचे वास्तू सुधारणा, रत्न शिफारस आणि उपाय, उत्सव व जीवन महत्त्वाच्या प्रसंगी पूजा व हवन यांचा समावेश करते — यात वास्तू शांती, कालसर्प शांती, सप्तशती पाठ हवन (नवचंडी), विवाह व उपनयन संस्कारांचा समावेश आहे.",
      "पारंपारिक ज्योतिषाच्या पलीकडे, गुरुजी आकाशिक रेकॉर्ड रीडिंग आणि रेकी उपचार देखील देतात, ज्यामुळे शास्त्रीय ज्योतिष आणि समग्र कल्याण पद्धती एकत्र येतात.",
    ],
    credentials: [
      "वेद व ज्योतिष विशारद",
      "वास्तुशास्त्र सल्लागार",
      "रत्नशास्त्र (रत्नविज्ञान) तज्ज्ञ",
      "श्री विद्या उपासक",
    ],
  },
  hi: {
    bio: [
      "राहुल चंद्रकांत जोशी-हारंगुळकर लातूर, महाराष्ट्र में स्थित वेद, ज्योतिष, वास्तु व रत्नशास्त्र विशारद और श्री विद्या उपासक हैं। वैदिक शास्त्र की गहरी समझ और वर्षों से परिवारों को जीवन के महत्वपूर्ण निर्णयों में मार्गदर्शन करने के अनुभव के साथ, गुरुजी अनुष्ठान सटीकता और व्यक्तिगत, करुणामयी मार्गदर्शन का दुर्लभ संयोजन प्रदान करते हैं।",
      "गुरुजी की सेवाओं में जन्म कुंडली विश्लेषण, घर और व्यापार के लिए वास्तु सुधार, रत्न परामर्श, और उपाय, उत्सव और जीवन के महत्वपूर्ण अवसरों पर पूजा और हवन शामिल हैं — जिसमें वास्तु शांति, कालसर्प शांति, सप्तशती पाठ हवन (नवचंडी), विवाह और उपनयन संस्कार सम्मिलित हैं।",
      "पारंपारिक ज्योतिष से परे, गुरुजी आकाशिक रिकॉर्ड रीडिंग और रेकी उपचार भी प्रदान करते हैं, जो शास्त्रीय ज्योतिष को समग्र कल्याण पद्धतियों के साथ जोड़ते हैं।",
    ],
    credentials: [
      "वेद एवं ज्योतिष विशारद",
      "वास्तुशास्त्र परामर्शदाता",
      "रत्नशास्त्र (रत्नविज्ञान) विशेषज्ञ",
      "श्री विद्या उपासक",
    ],
  },
};

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const content = aboutContent[locale] || aboutContent.en;

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-2">{dict.nav.about}</h1>
      <p className="text-brass mb-8">{dict.home.heroSubtitle}</p>

      <div className="plaque p-6 md:p-8 mb-8">
        <div className="relative z-10 text-cream/90 space-y-4 leading-relaxed">
          {content.bio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {content.credentials.map((cred) => (
          <div key={cred} className="border border-ink-3 rounded-md px-4 py-3 text-cream/90 text-sm">
            {cred}
          </div>
        ))}
      </div>
    </div>
  );
}

