import { migrate } from "drizzle-orm/postgres-js/migrator";
import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// import { migrate } from "drizzle-orm/neon-http/migrator";
// import { db } from "@/server/db";

const databaseUrl = drizzle(
  postgres(`${env.DATABASE_URL}`, { ssl: "require", max: 1 }),
);

const main = async () => {
  try {
    console.log("Starting migration...");
    await migrate(databaseUrl, { migrationsFolder: "./drizzle" });
    console.log("Migration Complete");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};

main();
