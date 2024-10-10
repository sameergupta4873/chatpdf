import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

// if (!process.env.DATABASE_URL) {
//   throw new Error("database url not found");
// }

const sql = neon("postgresql://neondb_owner:IV2rmyXijG5C@ep-raspy-tree-a1plz45t.ap-southeast-1.aws.neon.tech/neondb?sslmode=require");

export const db = drizzle(sql);
