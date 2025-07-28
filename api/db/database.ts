import { Kysely, SqliteDialect } from 'kysely';
import { DB } from './types.ts';
import { Database as SQLiteDB } from "sqlite";

const dialect = new SqliteDialect({
  database: new SQLiteDB("baseball.db"),
});

export const db = new Kysely<DB>({
  dialect,
});
