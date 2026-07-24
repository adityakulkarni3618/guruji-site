"use client";

import { useState } from "react";

export default function TestimonialSubmitForm({ dict, locale }) {
  const [form, setForm] = useState({ customerName: "", city: "", textEn: "", rating: 5 });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const labels = {
    formTitle: {
      en: "Share Your Experience",
      hi: "अपना अनुभव साझा करें",
      mr: "तुमचा अनुभव सामायिक करा",
    }[locale] || "Share Your Experience",
    nameLabel: {
      en: "Your Name",
      hi: "आपका नाम",
      mr: "तुमचे नाव",
    }[locale] || "Your Name",
    cityLabel: {
      en: "City (Optional)",
      hi: "शहर (वैकल्पिक)",
      mr: "शहर (पर्यायी)",
    }[locale] || "City (Optional)",
    textLabel: {
      en: "Your Experience / Blessings",
      hi: "आपका अनुभव / आशीर्वाद",
      mr: "तुमचा अनुभव / अभिप्राय",
    }[locale] || "Your Experience / Blessings",
    ratingLabel: {
      en: "Rating",
      hi: "रेटिंग",
      mr: "रेटिंग",
    }[locale] || "Rating",
    submitBtn: {
      en: "Submit Review",
      hi: "समीक्षा जमा करें",
      mr: "अभिप्राय सबमिट करा",
    }[locale] || "Submit Review",
    successMsg: {
      en: "Thank you! Your experience has been sent to Guruji for approval and will be published soon.",
      hi: "धन्यवाद! आपका अनुभव गुरुजी को स्वीकृति के लिए भेज दिया गया है और जल्द ही प्रकाशित किया जाएगा।",
      mr: "धन्यवाद! तुमचा अनुभव गुरुजींकडे मंजुरीसाठी पाठवला गेला आहे आणि लवकरच प्रकाशित केला जाईल.",
    }[locale] || "Thank you! Your experience has been sent to Guruji for approval and will be published soon.",
    errorMsg: {
      en: "Failed to submit review. Please try again.",
      hi: "समीक्षा सबमिट करने में विफल। कृपया पुन: प्रयास करें।",
      mr: "अभिप्राय सबमिट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
    }[locale] || "Failed to submit review. Please try again.",
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ customerName: "", city: "", textEn: "", rating: 5 });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="plaque p-6 text-center border border-brass/30">
        <span className="text-3xl block mb-2">🕉️</span>
        <p className="text-brass font-medium text-sm leading-relaxed">{labels.successMsg}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs text-cream-dim hover:text-cream underline cursor-pointer"
        >
          Submit another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="plaque p-6 md:p-8 space-y-4 relative">
      <h2 className="text-xl text-brass font-semibold font-display relative z-10">{labels.formTitle}</h2>
      
      <div className="relative z-10 space-y-3.5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-cream-dim mb-1">{labels.nameLabel} *</label>
            <input
              required
              placeholder="e.g. Rahul Joshi"
              value={form.customerName}
              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-xs text-cream-dim mb-1">{labels.cityLabel}</label>
            <input
              placeholder="e.g. Pune"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-cream-dim mb-1">{labels.textLabel} *</label>
          <textarea
            required
            rows={3}
            placeholder="Write your experience..."
            value={form.textEn}
            onChange={(e) => setForm((f) => ({ ...f, textEn: e.target.value }))}
            className="form-input"
          />
        </div>

        <div>
          <label className="block text-xs text-cream-dim mb-1">{labels.ratingLabel}</label>
          <div className="flex gap-1.5 mt-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setForm((f) => ({ ...f, rating: val }))}
                className={`text-xl transition-transform active:scale-95 cursor-pointer ${
                  form.rating >= val ? "text-brass scale-110" : "text-cream-dim/20"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {status === "error" && (
          <p className="text-sindoor-light text-xs">{labels.errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-sindoor hover:bg-brass hover:text-ink text-cream font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60 cursor-pointer text-sm border border-sindoor hover:border-brass"
        >
          {status === "submitting" ? "..." : labels.submitBtn}
        </button>
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          background: var(--color-ink-2);
          border: 1px solid var(--color-ink-3);
          color: var(--color-cream);
          border-radius: 0.375rem;
          padding: 0.55rem 0.75rem;
          font-size: 0.85rem;
        }
        .form-input:focus {
          outline: 2px solid var(--color-brass);
          outline-offset: 1px;
        }
      `}</style>
    </form>
  );
}
