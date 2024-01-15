// import { Client } from "@planetscale/database";
// import { drizzle } from "drizzle-orm/planetscale-serverless";

// import { env } from "@/env";
// import * as schema from "./schema";

// export const db = drizzle(
//   new Client({
//     url: env.DATABASE_URL,
//   }).connection(),
//   { schema }
// );

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/env";
import * as schema from "./schema";

// const pool = new Pool({ connectionString: env.DATABASE_URL });
const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
