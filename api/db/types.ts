import { Generated } from 'kysely';

export interface PlayerTable {
  id: string;
  first_name: string;
  last_name: string;
  jersey_number: string;
  birth_date: string; // YYYY-MM-DD
  team_id: string;
}

export interface TeamTable {
  id: string;
  name: string;
  city: string;
}

export interface TournamentTable {
  id: string;
  name: string;
  location_address: string;
  location_city: string;
  location_zip_code: string;
  date: string; // ISO 8601
}

export interface MatchTable {
  id: string;
  tournament_id: string;
  team1_id: string;
  team2_id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  score: string | null;
}

// Database interface for Kysely
export interface DB {
  players: PlayerTable;
  teams: TeamTable;
  tournaments: TournamentTable;
  matches: MatchTable;
}
