"use client";

import { useState } from "react";

export default function NewsletterSubscription({ locale }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const texts = {
    en: {
      title: "Devotee Newsletter",
      desc: "Subscribe to receive monthly auspicious Muhurat dates, panchang tips, and festival announcements directly in your inbox.",
      placeholder: "Enter your email address",
      btn: "Subscribe",
      loading: "Subscribing...",
      success: "Thank you for subscribing!",
      error: "Something went wrong. Please try again.",
    },
    hi: {
      title: "भक्त समाचार पत्र (न्यूज़लेटर)",
      desc: "सीधे अपने इनबॉक्स में मासिक शुभ मुहूर्त तिथियां, पंचांग सुझाव और त्योहारों की घोषणाएं प्राप्त करने के लिए सदस्यता लें।",
      placeholder: "अपना ईमेल पता दर्ज करें",
      btn: "सदस्यता लें",
      loading: "सदस्यता ली जा रही है...",
      success: "सदस्यता लेने के लिए धन्यवाद!",
      error: "कुछ गलत हो गया। कृपया पुन: प्रयास करें।",
    },
    mr: {
      title: "भक्त वृत्तपत्र (न्यूझलेटर)",
      desc: "मासिक शुभ मुहूर्त तिथी, पंचांग टिप्स आणि सणांच्या घोषणा थेट तुमच्या इनबॉक्समध्ये मिळवण्यासाठी आजच सबस्क्राईब करा.",
      placeholder: "तुमचा ईमेल पत्ता लिहा",
      btn: "सबस्क्राईब करा",
      loading: "सबस्क्राईब होत आहे...",
      success: "सबस्क्राईब केल्याबद्दल धन्यवाद!",
      error: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
    }
  }[locale] || {};

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Subscription failed");
      const data = await res.json();
      setMessage(data.message || texts.success);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="plaque p-6 md:p-8 max-w-2xl mx-auto text-center relative overflow-hidden my-8">
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brass/10 via-brass/40 to-brass/10"></div>
      
      <div className="relative z-10 space-y-4">
        <div>
          <span className="text-[10px] tracking-widest text-brass font-bold uppercase block mb-1">
            📯 {texts.title}
          </span>
          <p className="text-sm text-cream-dim max-w-md mx-auto leading-relaxed">
            {texts.desc}
          </p>
        </div>

        {status === "success" ? (
          <div className="text-emerald-400 font-medium text-sm py-2 animate-in fade-in duration-200">
            ✓ {message}
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
            <input
              required
              type="email"
              placeholder={texts.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="input flex-1 min-w-0"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-sindoor hover:bg-brass hover:text-ink text-cream font-semibold px-6 py-2.5 rounded-md transition-all text-sm shrink-0 cursor-pointer select-none disabled:opacity-60"
            >
              {status === "loading" ? texts.loading : texts.btn}
            </button>
          </form>
        )}

        {status === "error" && (
          <div className="text-sindoor-light text-xs animate-in fade-in duration-200">
            ⚠️ {texts.error}
          </div>
        )}
      </div>

      <style jsx global>{`
        .input {
          background: var(--color-ink-2);
          border: 1px solid var(--color-ink-3);
          color: var(--color-cream);
          border-radius: 0.375rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.85rem;
        }
        .input:focus {
          outline: 2px solid var(--color-brass);
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
}
