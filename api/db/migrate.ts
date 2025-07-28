import { Kysely, SqliteDialect, sql } from 'kysely';
import { DB } from './types.ts';
import { Database as SQLiteDB } from "sqlite";

const dialect = new SqliteDialect({
  database: new SQLiteDB("baseball.db"),
});

const db = new Kysely<DB>({
  dialect,
});

async function migrate() {
  const migrationsDir = "./api/db/migrations";
  const migrationFiles = [];

  for await (const dirEntry of Deno.readDir(migrationsDir)) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".sql")) {
      migrationFiles.push(dirEntry.name);
    }
  }
  migrationFiles.sort();

  await db.schema
    .createTable("kysely_migration")
    .ifNotExists()
    .addColumn("name", "text", (col) => col.notNull().primaryKey())
    .addColumn("timestamp", "text", (col) => col.notNull())
    .execute();

  for (const file of migrationFiles) {
    const migrationName = file.replace(".sql", "");
    const hasRun = await db
      .selectFrom("kysely_migration")
      .where("name", "=", migrationName)
      .selectAll()
      .executeTakeFirst();

    if (!hasRun) {
      console.log(`Running migration: ${file}`);
      const sqlContent = await Deno.readTextFile(`${migrationsDir}/${file}`);
      await sql.raw(sqlContent).execute(db);
      await db
        .insertInto("kysely_migration")
        .values({ name: migrationName, timestamp: new Date().toISOString() })
        .execute();
    } else {
      console.log(`Migration already run: ${file}`);
    }
  }

  await db.destroy();
}

migrate();
