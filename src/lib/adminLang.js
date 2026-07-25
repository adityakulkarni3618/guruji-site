import { dictionaries } from "@/i18n/dictionaries";

export function getAdminDict() {
  if (typeof window === "undefined") return dictionaries.mr;
  const lang = localStorage.getItem("admin-lang") || "mr";
  return dictionaries[lang] || dictionaries.mr;
}

export function getAdminLang() {
  if (typeof window === "undefined") return "mr";
  return localStorage.getItem("admin-lang") || "mr";
}

export function setAdminLang(lang) {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin-lang", lang);
    window.dispatchEvent(new Event("admin-lang-change"));
  }
}
