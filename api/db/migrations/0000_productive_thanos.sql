CREATE TABLE `matches` (
	`id` text PRIMARY KEY NOT NULL,
	`tournament_id` text NOT NULL,
	`team1_id` text NOT NULL,
	`team2_id` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`score` text
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`jersey_number` text NOT NULL,
	`birth_date` text NOT NULL,
	`team_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `players_jersey_number_unique` ON `players` (`jersey_number`);--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tournament_teams` (
	`tournament_id` text NOT NULL,
	`team_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tournaments` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`location_address` text NOT NULL,
	`location_city` text NOT NULL,
	`location_zip_code` text NOT NULL,
	`date` text NOT NULL
);
