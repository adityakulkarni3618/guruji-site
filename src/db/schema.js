// Database schema (Drizzle ORM, PostgreSQL)
// Designed for: Supabase / Neon / any managed Postgres (free tier friendly).
// Why Postgres: bookings, services, and samagri lists are relational —
// we need real foreign keys and constraints so data never gets orphaned
// or duplicated, and we get row-level security + automatic backups for free
// on Supabase, which matters for a business handling customer contact info.

import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  date,
  time,
  jsonb,
} from "drizzle-orm/pg-core";

// ---------- Admin users (Guruji + one assistant) ----------
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("assistant"), // 'owner' | 'assistant'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Services / Poojas ----------
// Multi-language fields stored side by side (nameEn/nameHi/nameMr) so the
// admin panel can show one edit form with three language tabs, and the
// public site just picks the right column per active locale. Simple,
// query-fast, no separate translations table needed for this content size.
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  category: varchar("category", { length: 60 }).notNull().default("pooja"),
  // 'pooja' | 'vastu' | 'jyotish' | 'gemstone' | 'muhurat' | 'reiki' | 'other'

  nameEn: varchar("name_en", { length: 200 }).notNull(),
  nameHi: varchar("name_hi", { length: 200 }),
  nameMr: varchar("name_mr", { length: 200 }),

  shortDescEn: text("short_desc_en"),
  shortDescHi: text("short_desc_hi"),
  shortDescMr: text("short_desc_mr"),

  descriptionEn: text("description_en"),
  descriptionHi: text("description_hi"),
  descriptionMr: text("description_mr"),

  // Samagri (ritual items required) stored as a simple list of
  // { itemEn, itemHi, itemMr, qty } objects — flexible, editable from admin
  // without needing a separate join table for a list this small per pooja.
  samagri: jsonb("samagri").default([]),

  durationMinutes: integer("duration_minutes"),
  price: integer("price"), // in INR, nullable — admin may choose not to publish price
  priceNote: varchar("price_note", { length: 200 }), // e.g. "Contact for pricing"

  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- Bookings (no payment — contact-based advance booking) ----------
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").references(() => services.id),

  customerName: varchar("customer_name", { length: 160 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  customerEmail: varchar("customer_email", { length: 160 }),
  city: varchar("city", { length: 120 }),

  preferredDate: date("preferred_date"),
  preferredTime: time("preferred_time"),
  notes: text("notes"),

  status: varchar("status", { length: 20 }).notNull().default("pending"),
  // 'pending' | 'confirmed' | 'completed' | 'cancelled'

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Daily Panchang ----------
// Auto-calculated by our own astronomy engine (no paid API), one row per
// calendar date, with every field admin-editable/overridable if needed.
export const panchangEntries = pgTable("panchang_entries", {
  id: serial("id").primaryKey(),
  entryDate: date("entry_date").notNull().unique(),

  tithi: varchar("tithi", { length: 120 }),
  nakshatra: varchar("nakshatra", { length: 120 }),
  yoga: varchar("yoga", { length: 120 }),
  karan: varchar("karan", { length: 120 }),
  paksha: varchar("paksha", { length: 20 }), // Shukla / Krishna

  sunrise: time("sunrise"),
  sunset: time("sunset"),
  moonrise: time("moonrise"),
  moonset: time("moonset"),

  rahuKaalStart: time("rahu_kaal_start"),
  rahuKaalEnd: time("rahu_kaal_end"),
  gulikaKaalStart: time("gulika_kaal_start"),
  gulikaKaalEnd: time("gulika_kaal_end"),
  yamaganda_start: time("yamaganda_start"),
  yamagandaEnd: time("yamaganda_end"),

  shubhMuhuratNoteEn: text("shubh_muhurat_note_en"),
  shubhMuhuratNoteHi: text("shubh_muhurat_note_hi"),
  shubhMuhuratNoteMr: text("shubh_muhurat_note_mr"),

  isManualOverride: boolean("is_manual_override").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- Muhurat dates (marriage, griha pravesh, etc.) ----------
export const muhuratDates = pgTable("muhurat_dates", {
  id: serial("id").primaryKey(),
  eventType: varchar("event_type", { length: 80 }).notNull(),
  // 'vivah' | 'griha_pravesh' | 'vahan_kharedi' | 'namkaran' | 'other'
  eventDate: date("event_date").notNull(),
  timeWindow: varchar("time_window", { length: 120 }),
  noteEn: text("note_en"),
  noteHi: text("note_hi"),
  noteMr: text("note_mr"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Gallery ----------
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  mediaType: varchar("media_type", { length: 10 }).notNull().default("image"), // image | video
  url: text("url").notNull(),
  captionEn: varchar("caption_en", { length: 200 }),
  captionHi: varchar("caption_hi", { length: 200 }),
  captionMr: varchar("caption_mr", { length: 200 }),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Testimonials ----------
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  city: varchar("city", { length: 120 }),
  photoUrl: text("photo_url"),
  textEn: text("text_en"),
  textHi: text("text_hi"),
  textMr: text("text_mr"),
  rating: integer("rating").default(5),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Blog / Articles ----------
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  titleEn: varchar("title_en", { length: 250 }),
  titleHi: varchar("title_hi", { length: 250 }),
  titleMr: varchar("title_mr", { length: 250 }),
  bodyEn: text("body_en"),
  bodyHi: text("body_hi"),
  bodyMr: text("body_mr"),
  coverImageUrl: text("cover_image_url"),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Contact / Inquiry form submissions ----------
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 160 }),
  message: text("message"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
