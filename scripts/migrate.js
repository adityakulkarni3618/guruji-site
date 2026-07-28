// Run with: node scripts/migrate.js
import "dotenv/config";
import postgres from "postgres";

async function main() {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) throw new Error("DATABASE_URL is required.");

  console.log("Connecting to database...");
  const sql = postgres(DATABASE_URL, { prepare: false });

  console.log("Creating daily_shlokas table if not exists...");
  await sql`
    CREATE TABLE IF NOT EXISTS daily_shlokas (
      id SERIAL PRIMARY KEY,
      shloka TEXT NOT NULL,
      translation_en TEXT,
      translation_hi TEXT,
      translation_mr TEXT,
      display_date VARCHAR(10),
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;
  
  console.log("Table daily_shlokas created successfully!");

  console.log("Creating subscribers table if not exists...");
  await sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(160) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;
  console.log("Table subscribers created successfully!");
  await sql.end();
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
