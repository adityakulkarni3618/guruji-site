import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// DATABASE_URL comes from your Supabase (or Neon) project settings.
// Example: postgres://user:password@host:5432/postgres
if (!process.env.DATABASE_URL) {
  console.warn(
    "[db] DATABASE_URL is not set. Add it to .env.local — see README for the free Supabase setup steps."
  );
}

const client = postgres(process.env.DATABASE_URL || "", {
  prepare: false, // required for Supabase's connection pooler (pgbouncer)
});

export const db = drizzle(client, { schema });
