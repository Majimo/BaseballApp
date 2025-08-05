import { type Migration, type MigrationProvider, sql } from 'kysely';
import * as path from 'https://deno.land/std@0.224.0/path/mod.ts';

export class DenoFileMigrationProvider implements MigrationProvider {
  readonly #folder: string;

  constructor(folder: string) {
    this.#folder = folder;
  }

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};
    const files = Deno.readDir(this.#folder);

    for await (const file of files) {
      if (
        file.isFile &&
        file.name.endsWith('.sql')
      ) {
        const migrationName = path.parse(file.name).name;
        const content = await Deno.readTextFile(path.join(this.#folder, file.name));
        migrations[migrationName] = {
          up: async (db) => {
            const statements = content.split(/;\s*$/m)
              .map(it => it.trim())
              .filter(it => it.length > 0);

            for (const stmt of statements) {
              await sql.raw(stmt).execute(db);
            }
          },
        };
      }
    }
    return migrations;
  }
}
