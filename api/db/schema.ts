import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const players = sqliteTable('players', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  jerseyNumber: text('jersey_number').notNull().unique(),
  birthDate: text('birth_date').notNull(), // YYYY-MM-DD
  teamId: text('team_id').notNull(),
});

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
});

export const tournaments = sqliteTable('tournaments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  locationAddress: text('location_address').notNull(),
  locationCity: text('location_city').notNull(),
  locationZipCode: text('location_zip_code').notNull(),
  date: text('date').notNull(), // ISO 8601
});

export const matches = sqliteTable('matches', {
  id: text('id').primaryKey(),
  tournamentId: text('tournament_id').notNull(),
  team1Id: text('team1_id').notNull(),
  team2Id: text('team2_id').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(), // HH:MM
  score: text('score'),
});

export const tournamentTeams = sqliteTable('tournament_teams', {
  tournamentId: text('tournament_id').notNull(),
  teamId: text('team_id').notNull(),
});
