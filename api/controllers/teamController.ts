import { RouterContext } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import { Team } from "../models/team.ts";

const teams: Team[] = [];

export const getTeams = (ctx: RouterContext<string>) => {
  ctx.response.body = teams;
};

export const getTeamById = (ctx: RouterContext<string>) => {
  const { id } = ctx.params;
  const team = teams.find((t) => t.id === id);
  if (team) {
    ctx.response.body = team;
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Team not found" };
  }
};

export const createTeam = async (ctx: RouterContext) => {
  const body = await ctx.request.body().value;
  const newTeam: Team = {
    id: crypto.randomUUID(),
    name: body.name,
    city: body.city,
    players: [],
  };
  teams.push(newTeam);
  ctx.response.status = 201;
  ctx.response.body = newTeam;
};

export const updateTeam = async (ctx: RouterContext) => {
  const { id } = ctx.params;
  const body = await ctx.request.body().value;
  const index = teams.findIndex((t) => t.id === id);
  if (index !== -1) {
    teams[index] = { ...teams[index], ...body };
    ctx.response.body = teams[index];
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "Team not found" };
  }
};
