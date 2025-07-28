import { RouterContext } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import { Tournament, Match, Team } from "../models/tournament.ts"; // Assuming Tournament, Match, Team are defined here or in separate files
import tournamentService from "../services/tournamentService.ts";
import { db } from "../db/database.ts";

export const getTournaments = async (ctx: RouterContext) => {
  try {
    const tournaments = await db.selectFrom('tournaments').selectAll().execute();
    // For a complete Tournament object, you would need to join with teams and matches tables
    // and reconstruct the object. For simplicity, returning raw tournament data for now.
    ctx.response.body = tournaments.map(t => ({
      id: t.id,
      name: t.name,
      location: {
        address: t.location_address,
        city: t.location_city,
        zipCode: t.location_zip_code,
      },
      date: new Date(t.date), // Convert string back to Date
      teams: [], // Teams would need to be fetched via a join
      matches: [], // Matches would need to be fetched via a join
    }));
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to fetch tournaments", error: error.message };
  }
};

export const getTournamentById = async (ctx: RouterContext) => {
  const { id } = ctx.params;
  try {
    const tournament = await db.selectFrom('tournaments').where('id', '=', id).selectAll().executeTakeFirst();
    if (tournament) {
      // Similarly, fetch associated teams and matches here if needed for the full object
      ctx.response.body = {
        id: tournament.id,
        name: tournament.name,
        location: {
          address: tournament.location_address,
          city: tournament.location_city,
          zipCode: tournament.location_zip_code,
        },
        date: new Date(tournament.date),
        teams: [],
        matches: [],
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Tournament not found" };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to fetch tournament", error: error.message };
  }
};

export const createTournament = async (ctx: RouterContext) => {
  try {
    const body = await ctx.request.body().value;
    const newTournamentId = crypto.randomUUID();

    // Insert tournament data
    const tournamentData = {
      id: newTournamentId,
      name: body.name,
      location_address: body.location.address,
      location_city: body.location.city,
      location_zip_code: body.location.zipCode,
      date: new Date(body.date).toISOString(), // Store as ISO string
    };
    await db.insertInto('tournaments').values(tournamentData).execute();

    // Generate and insert matches
    const generatedMatches = tournamentService.generateMatches(body.teams as Team[]);
    const matchesToInsert = generatedMatches.map(m => ({
      id: crypto.randomUUID(),
      tournament_id: newTournamentId,
      team1_id: m.team1Id,
      team2_id: m.team2Id,
      date: m.date.toISOString().split('T')[0], // Store as YYYY-MM-DD
      time: m.time,
      score: null, // Initial score is null
    }));

    if (matchesToInsert.length > 0) {
      await db.insertInto('matches').values(matchesToInsert).execute();
    }

    // Fetch the newly created tournament with its generated matches for the response
    const createdTournament = await db.selectFrom('tournaments').where('id', '=', newTournamentId).selectAll().executeTakeFirst();
    const associatedMatches = await db.selectFrom('matches').where('tournament_id', '=', newTournamentId).selectAll().execute();

    ctx.response.status = 201;
    ctx.response.body = {
      id: createdTournament?.id,
      name: createdTournament?.name,
      location: {
        address: createdTournament?.location_address,
        city: createdTournament?.location_city,
        zipCode: createdTournament?.location_zip_code,
      },
      date: new Date(createdTournament?.date || ''),
      teams: body.teams, // Teams are passed in the request, not fetched from DB here
      matches: associatedMatches.map(m => ({
        id: m.id,
        tournamentId: m.tournament_id,
        team1Id: m.team1_id,
        team2Id: m.team2_id,
        date: new Date(m.date), // Convert string back to Date
        time: m.time,
        score: m.score || '',
      })),
    };

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to create tournament", error: error.message };
  }
};

export const updateTournament = async (ctx: RouterContext) => {
  const { id } = ctx.params;
  try {
    const body = await ctx.request.body().value;
    const updatedData: Record<string, unknown> = {
      name: body.name,
      date: new Date(body.date).toISOString(),
    };
    if (body.location) {
      updatedData.location_address = body.location.address;
      updatedData.location_city = body.location.city;
      updatedData.location_zip_code = body.location.zipCode;
    }

    const result = await db.updateTable('tournaments').set(updatedData).where('id', '=', id).executeTakeFirst();

    if (result?.numUpdatedRows && result.numUpdatedRows > 0) {
      const updatedTournament = await db.selectFrom('tournaments').where('id', '=', id).selectAll().executeTakeFirst();
      ctx.response.body = {
        id: updatedTournament?.id,
        name: updatedTournament?.name,
        location: {
          address: updatedTournament?.location_address,
          city: updatedTournament?.location_city,
          zipCode: updatedTournament?.location_zip_code,
        },
        date: new Date(updatedTournament?.date || ''),
        teams: [], // Not updated here
        matches: [], // Not updated here
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Tournament not found" };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to update tournament", error: error.message };
  }
};

export const getTournamentMatches = async (ctx: RouterContext) => {
    const { id } = ctx.params;
    try {
        const matches = await db.selectFrom('matches').where('tournament_id', '=', id).selectAll().execute();
        ctx.response.body = matches.map(m => ({
            id: m.id,
            tournamentId: m.tournament_id,
            team1Id: m.team1_id,
            team2Id: m.team2_id,
            date: new Date(m.date),
            time: m.time,
            score: m.score || '',
        }));
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Failed to fetch tournament matches", error: error.message };
    }
};

export const addTournamentMatch = async (ctx: RouterContext) => {
    const { id } = ctx.params;
    try {
        const body = await ctx.request.body().value;
        const newMatchId = crypto.randomUUID();
        const matchToInsert = {
            id: newMatchId,
            tournament_id: id,
            team1_id: body.team1Id,
            team2_id: body.team2Id,
            date: new Date(body.date).toISOString().split('T')[0],
            time: body.time,
            score: body.score || null,
        };
        await db.insertInto('matches').values(matchToInsert).execute();
        const createdMatch = await db.selectFrom('matches').where('id', '=', newMatchId).selectAll().executeTakeFirst();
        ctx.response.status = 201;
        ctx.response.body = {
            id: createdMatch?.id,
            tournamentId: createdMatch?.tournament_id,
            team1Id: createdMatch?.team1_id,
            team2Id: createdMatch?.team2_id,
            date: new Date(createdMatch?.date || ''),
            time: createdMatch?.time,
            score: createdMatch?.score || '',
        };
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Failed to add match", error: error.message };
    }
};

export const updateTournamentMatch = async (ctx: RouterContext) => {
    const { id, idMatch } = ctx.params;
    try {
        const body = await ctx.request.body().value;
        const updatedData: Record<string, unknown> = {
            team1_id: body.team1Id,
            team2_id: body.team2Id,
            date: new Date(body.date).toISOString().split('T')[0],
            time: body.time,
            score: body.score || null,
        };
        const result = await db.updateTable('matches').set(updatedData).where('id', '=', idMatch).where('tournament_id', '=', id).executeTakeFirst();

        if (result?.numUpdatedRows && result.numUpdatedRows > 0) {
            const updatedMatch = await db.selectFrom('matches').where('id', '=', idMatch).selectAll().executeTakeFirst();
            ctx.response.body = {
                id: updatedMatch?.id,
                tournamentId: updatedMatch?.tournament_id,
                team1Id: updatedMatch?.team1_id,
                team2Id: updatedMatch?.team2_id,
                date: new Date(updatedMatch?.date || ''),
                time: updatedMatch?.time,
                score: updatedMatch?.score || '',
            };
        } else {
            ctx.response.status = 404;
            ctx.response.body = { message: "Match not found" };
        }
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Failed to update match", error: error.message };
    }
};