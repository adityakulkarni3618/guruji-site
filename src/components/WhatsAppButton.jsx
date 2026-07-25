"use client";

import { useState } from "react";

const OPTIONS = {
  en: [
    {
      label: "Book Pooja / Service",
      icon: "🕉️",
      text: "Namaste Guruji 🙏\n\nI would like to book a Pooja or Vastu consultation. Please guide me about the process and availability.",
    },
    {
      label: "Janam Kundali Reading",
      icon: "🔮",
      text: "Namaste Guruji 🙏\n\nI would like to schedule a personal Janam Kundali reading session. Please let me know your available timings.",
    },
    {
      label: "Vastu Shastra Inquiry",
      icon: "🏠",
      text: "Namaste Guruji 🙏\n\nI want to consult you regarding Vastu Shastra for my home / office. Please guide me.",
    },
    {
      label: "General Inquiry",
      icon: "💬",
      text: "Namaste Guruji 🙏\n\nI have a query and would like to speak with you at your convenience.",
    },
  ],
  hi: [
    {
      label: "पूजा / सेवा बुक करें",
      icon: "🕉️",
      text: "नमस्ते गुरुजी 🙏\n\nमैं एक पूजा या वास्तु परामर्श बुक करना चाहता/चाहती हूँ। कृपया प्रक्रिया और उपलब्धता के बारे में बताएं।",
    },
    {
      label: "जन्म कुंडली वाचन",
      icon: "🔮",
      text: "नमस्ते गुरुजी 🙏\n\nमैं व्यक्तिगत जन्म कुंडली वाचन के लिए समय निश्चित करना चाहता/चाहती हूँ। कृपया उपलब्ध समय बताएं।",
    },
    {
      label: "वास्तु शास्त्र परामर्श",
      icon: "🏠",
      text: "नमस्ते गुरुजी 🙏\n\nमैं अपने घर / कार्यालय के लिए वास्तु शास्त्र के बारे में परामर्श लेना चाहता/चाहती हूँ। कृपया मार्गदर्शन करें।",
    },
    {
      label: "सामान्य पूछताछ",
      icon: "💬",
      text: "नमस्ते गुरुजी 🙏\n\nमुझे एक प्रश्न पूछना है। कृपया सुविधा अनुसार बात करें।",
    },
  ],
  mr: [
    {
      label: "पूजा / सेवा बुक करा",
      icon: "🕉️",
      text: "नमस्कार गुरुजी 🙏\n\nमला एक पूजा किंवा वास्तु सल्लामसलत बुक करायची आहे. कृपया प्रक्रिया आणि उपलब्धतेबद्दल माहिती द्या.",
    },
    {
      label: "जन्मकुंडली वाचन",
      icon: "🔮",
      text: "नमस्कार गुरुजी 🙏\n\nमला वैयक्तिक जन्मकुंडली वाचनासाठी वेळ निश्चित करायचा आहे. कृपया उपलब्ध वेळ सांगा.",
    },
    {
      label: "वास्तुशास्त्र सल्ला",
      icon: "🏠",
      text: "नमस्कार गुरुजी 🙏\n\nमला माझ्या घर / कार्यालयासाठी वास्तुशास्त्राबाबत सल्ला घ्यायचा आहे. कृपया मार्गदर्शन करा.",
    },
    {
      label: "सामान्य चौकशी",
      icon: "💬",
      text: "नमस्कार गुरुजी 🙏\n\nमला एक प्रश्न विचारायचा आहे. कृपया सवडीनुसार बोलू.",
    },
  ],
};

export default function WhatsAppButton({ locale = "en" }) {
  const [isOpen, setIsOpen] = useState(false);
  const phone = "919823324839";
  const options = OPTIONS[locale] || OPTIONS.en;

  return (
    <>
      {/* Phone Call Button */}
      <a
        href="tel:+919823324839"
        aria-label="Call Guruji"
        className="fixed bottom-22 right-5 z-50 w-14 h-14 rounded-full bg-sindoor flex items-center justify-center shadow-lg hover:scale-105 transition-transform border border-brass/30"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.27c1.12.42 2.33.64 3.57.64a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.22 2.45.64 3.57a1 1 0 0 1-.27 1.11z"/>
        </svg>
      </a>

      {/* WhatsApp Button Menu Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {/* Expanded actions list */}
        {isOpen && (
          <div className="flex flex-col items-end gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {options.map((opt, idx) => {
              const url = `https://wa.me/${phone}?text=${encodeURIComponent(opt.text)}`;
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 bg-ink-2 hover:bg-ink-3 text-cream hover:text-brass border border-ink-3 hover:border-brass/45 px-4.5 py-2.5 rounded-full shadow-2xl text-xs font-semibold select-none cursor-pointer transition-all hover:scale-103"
                  style={{
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <span className="tracking-wide">{opt.label}</span>
                  <span className="text-sm">{opt.icon}</span>
                </a>
              );
            })}
          </div>
        )}

        {/* Main Green Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Chat on WhatsApp"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba56] flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
        >
          {isOpen ? (
            <span className="text-white text-xl font-bold">✕</span>
          ) : (
            <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.12-.42-.13-.95-.31-1.64-.6-2.9-1.25-4.79-4.16-4.94-4.35-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.51-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.26.1 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
