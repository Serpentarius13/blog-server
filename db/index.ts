import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "./schema"; // this is the Database interface we defined earlier

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
