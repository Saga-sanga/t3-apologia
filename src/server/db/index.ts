import { Pool, neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/env";
import * as schema from "./schema";

// const pool = new Pool({ connectionString: env.DATABASE_URL });
const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
