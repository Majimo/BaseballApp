-- 001_initial_schema.sql

CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    jersey_number TEXT NOT NULL UNIQUE,
    birth_date TEXT NOT NULL, -- YYYY-MM-DD format
    team_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tournaments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location_address TEXT NOT NULL,
    location_city TEXT NOT NULL,
    location_zip_code TEXT NOT NULL,
    date TEXT NOT NULL -- ISO 8601 format (e.g., YYYY-MM-DDTHH:MM:SSZ)
);

CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    tournament_id TEXT NOT NULL,
    team1_id TEXT NOT NULL,
    team2_id TEXT NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD format
    time TEXT NOT NULL, -- HH:MM format
    score TEXT -- Can be NULL initially
);

-- Foreign key constraints (optional for SQLite, but good practice for PostgreSQL)
-- Note: SQLite does not enforce foreign key constraints by default unless enabled.
-- For PostgreSQL, these would be automatically enforced.

-- ALTER TABLE players ADD CONSTRAINT fk_team
-- FOREIGN KEY (team_id) REFERENCES teams(id)
-- ON DELETE CASCADE;

-- ALTER TABLE matches ADD CONSTRAINT fk_tournament
-- FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
-- ON DELETE CASCADE;

-- ALTER TABLE matches ADD CONSTRAINT fk_team1
-- FOREIGN KEY (team1_id) REFERENCES teams(id)
-- ON DELETE CASCADE;

-- ALTER TABLE matches ADD CONSTRAINT fk_team2
-- FOREIGN KEY (team2_id) REFERENCES teams(id)
-- ON DELETE CASCADE;
