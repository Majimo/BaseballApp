import type { Config } from 'drizzle-kit';

export default {
  schema: './api/db/schema.ts',
  out: './api/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './baseball.db',
  }
} satisfies Config;