import { RouterContext } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import { Tournament } from "../models/tournament.ts";
import tournamentService from "../services/tournamentService.ts";

const tournaments: Tournament[] = [];

export const getTournaments = (ctx: RouterContext<string>) => {
  ctx.response.body = tournaments;
};

export const getTournamentById = (ctx: RouterContext<string>) => {
  const { id } = ctx.params;
  const tournament = tournaments.find((t) => t.id === id);
  if (tournament) {
    ctx.response.body = tournament;
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Tournament not found" };
  }
};

export const createTournament = async (ctx: RouterContext) => {
  const body = await ctx.request.body().value;
  const newTournament: Tournament = {
    id: crypto.randomUUID(),
    name: body.name,
    location: body.location,
    date: body.date,
    teams: body.teams,
    matches: [],
  };
  newTournament.matches = tournamentService.generateMatches(newTournament.teams).map(m => ({...m, id: crypto.randomUUID(), tournamentId: newTournament.id, score: ''}));
  tournaments.push(newTournament);
  ctx.response.status = 201;
  ctx.response.body = newTournament;
};

export const updateTournament = async (ctx: RouterContext) => {
  const { id } = ctx.params;
  const body = await ctx.request.body().value;
  const index = tournaments.findIndex((t) => t.id === id);
  if (index !== -1) {
    tournaments[index] = { ...tournaments[index], ...body };
    ctx.response.body = tournaments[index];
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Tournament not found" };
  }
};

export const getTournamentMatches = (ctx: RouterContext<string>) => {
    const { id } = ctx.params;
    const tournament = tournaments.find((t) => t.id === id);
    if (tournament) {
        ctx.response.body = tournament.matches;
    } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Tournament not found" };
    }
};

export const addTournamentMatch = async (ctx: RouterContext) => {
    const { id } = ctx.params;
    const tournament = tournaments.find((t) => t.id === id);
    if (tournament) {
        const body = await ctx.request.body().value;
        const newMatch = {
            id: crypto.randomUUID(),
            tournamentId: id!,
            ...body
        }
        tournament.matches.push(newMatch);
        ctx.response.status = 201;
        ctx.response.body = newMatch;
    } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Tournament not found" };
    }
};

export const updateTournamentMatch = async (ctx: RouterContext) => {
    const { id, idMatch } = ctx.params;
    const tournament = tournaments.find((t) => t.id === id);
    if (tournament) {
        const body = await ctx.request.body().value;
        const index = tournament.matches.findIndex(m => m.id === idMatch);
        if (index !== -1) {
            tournament.matches[index] = { ...tournament.matches[index], ...body };
            ctx.response.body = tournament.matches[index];
        } else {
            ctx.response.status = 404;
            ctx.response.body = { message: "Match not found" };
        }
    } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Tournament not found" };
    }
};
