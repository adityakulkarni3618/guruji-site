import { revalidatePath } from "next/cache";

const LOCALES = ["en", "hi", "mr"];

/**
 * Call this after any admin write (create / update / delete).
 * It purges the ISR cache for the relevant public pages so visitors
 * see the new content immediately instead of waiting up to 60 s.
 */
export function revalidatePublicPages(type, slug) {
  try {
    // Always refresh the home page and its locale variants
    revalidatePath("/", "layout");
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}`, "page");
    }

    if (type === "service") {
      for (const locale of LOCALES) {
        revalidatePath(`/${locale}/services`, "page");
        if (slug) revalidatePath(`/${locale}/services/${slug}`, "page");
      }
    }

    if (type === "blog") {
      for (const locale of LOCALES) {
        revalidatePath(`/${locale}/blog`, "page");
        if (slug) revalidatePath(`/${locale}/blog/${slug}`, "page");
      }
    }

    if (type === "gallery") {
      for (const locale of LOCALES) {
        revalidatePath(`/${locale}/gallery`, "page");
      }
    }

    if (type === "testimonial") {
      for (const locale of LOCALES) {
        revalidatePath(`/${locale}/testimonials`, "page");
      }
    }

    if (type === "shloka") {
      for (const locale of LOCALES) {
        revalidatePath(`/${locale}/shlokas`, "page");
      }
    }

    if (type === "muhurat") {
      for (const locale of LOCALES) {
        revalidatePath(`/${locale}/muhurat`, "page");
      }
    }

    if (type === "panchang") {
      for (const locale of LOCALES) {
        revalidatePath(`/${locale}/panchang`, "page");
      }
    }
  } catch (e) {
    // revalidatePath is a no-op outside Next.js request context — safe to ignore
    console.warn("revalidatePublicPages skipped:", e?.message);
  }
}
