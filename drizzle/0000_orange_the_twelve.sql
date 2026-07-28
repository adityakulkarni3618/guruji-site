CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(160) NOT NULL,
	"password_hash" text NOT NULL,
	"role" varchar(20) DEFAULT 'assistant' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title_en" varchar(250),
	"title_hi" varchar(250),
	"title_mr" varchar(250),
	"body_en" text,
	"body_hi" text,
	"body_mr" text,
	"cover_image_url" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer,
	"customer_name" varchar(160) NOT NULL,
	"customer_phone" varchar(20) NOT NULL,
	"customer_email" varchar(160),
	"city" varchar(120),
	"preferred_date" date,
	"preferred_time" time,
	"notes" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_shlokas" (
	"id" serial PRIMARY KEY NOT NULL,
	"shloka" text NOT NULL,
	"translation_en" text,
	"translation_hi" text,
	"translation_mr" text,
	"display_date" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"media_type" varchar(10) DEFAULT 'image' NOT NULL,
	"url" text NOT NULL,
	"caption_en" varchar(200),
	"caption_hi" varchar(200),
	"caption_mr" varchar(200),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"phone" varchar(20),
	"email" varchar(160),
	"message" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "muhurat_dates" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" varchar(80) NOT NULL,
	"event_date" date NOT NULL,
	"time_window" varchar(120),
	"note_en" text,
	"note_hi" text,
	"note_mr" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "panchang_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"entry_date" date NOT NULL,
	"tithi" varchar(120),
	"nakshatra" varchar(120),
	"yoga" varchar(120),
	"karan" varchar(120),
	"paksha" varchar(20),
	"sunrise" time,
	"sunset" time,
	"moonrise" time,
	"moonset" time,
	"rahu_kaal_start" time,
	"rahu_kaal_end" time,
	"gulika_kaal_start" time,
	"gulika_kaal_end" time,
	"yamaganda_start" time,
	"yamaganda_end" time,
	"shubh_muhurat_note_en" text,
	"shubh_muhurat_note_hi" text,
	"shubh_muhurat_note_mr" text,
	"is_manual_override" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "panchang_entries_entry_date_unique" UNIQUE("entry_date")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"category" varchar(60) DEFAULT 'pooja' NOT NULL,
	"name_en" varchar(200) NOT NULL,
	"name_hi" varchar(200),
	"name_mr" varchar(200),
	"short_desc_en" text,
	"short_desc_hi" text,
	"short_desc_mr" text,
	"description_en" text,
	"description_hi" text,
	"description_mr" text,
	"samagri" jsonb DEFAULT '[]'::jsonb,
	"duration_minutes" integer,
	"price" integer,
	"price_note" varchar(200),
	"image_url" text,
	"pdf_url" text,
	"aarti_en" text,
	"aarti_hi" text,
	"aarti_mr" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(160) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" varchar(160) NOT NULL,
	"city" varchar(120),
	"photo_url" text,
	"text_en" text,
	"text_hi" text,
	"text_mr" text,
	"rating" integer DEFAULT 5,
	"is_approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;