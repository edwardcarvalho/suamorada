import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Normaliza localhost→127.0.0.1 para evitar ambiguidade IPv6 no Windows
const connectionString = process.env.DATABASE_URL?.replace("localhost", "127.0.0.1");

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;
