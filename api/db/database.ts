import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { Database as DB } from 'sqlite';
import * as schema from './schema.ts';

const sqlite = new DB('./data/baseball.db');
export const db = drizzle(sqlite, { schema });
