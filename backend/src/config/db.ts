import { Pool } from "pg";
import { env } from "./env";

// Single shared connection pool. Import `pool` anywhere you need to query.
export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl.includes("supabase.co") ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
});
