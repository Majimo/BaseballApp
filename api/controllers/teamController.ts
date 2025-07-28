import { RouterContext } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import { Team } from "../models/team.ts";
import { db } from "../db/database.ts";

export const getTeams = async (ctx: RouterContext) => {
  try {
    const teams = await db.selectFrom('teams').selectAll().execute();
    ctx.response.body = teams.map(t => ({
      id: t.id,
      name: t.name,
      city: t.city,
      players: [], // Players would need to be fetched via a join or separate query
    }));
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to fetch teams", error: error.message };
  }
};

export const getTeamById = async (ctx: RouterContext) => {
  const { id } = ctx.params;
  try {
    const team = await db.selectFrom('teams').where('id', '=', id).selectAll().executeTakeFirst();
    if (team) {
      // Fetch associated players here if needed for the full object
      ctx.response.body = {
        id: team.id,
        name: team.name,
        city: team.city,
        players: [],
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Team not found" };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to fetch team", error: error.message };
  }
};

export const createTeam = async (ctx: RouterContext) => {
  try {
    const body = await ctx.request.body().value;
    const newTeamId = crypto.randomUUID();
    const newTeam: Team = {
      id: newTeamId,
      name: body.name,
      city: body.city,
      players: [], // Players are added separately
    };
    await db.insertInto('teams').values(newTeam).execute();
    ctx.response.status = 201;
    ctx.response.body = newTeam;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to create team", error: error.message };
  }
};

export const updateTeam = async (ctx: RouterContext) => {
  const { id } = ctx.params;
  try {
    const body = await ctx.request.body().value;
    const updatedData: Record<string, unknown> = {
      name: body.name,
      city: body.city,
    };
    const result = await db.updateTable('teams').set(updatedData).where('id', '=', id).executeTakeFirst();

    if (result?.numUpdatedRows && result.numUpdatedRows > 0) {
      const updatedTeam = await db.selectFrom('teams').where('id', '=', id).selectAll().executeTakeFirst();
      ctx.response.body = {
        id: updatedTeam?.id,
        name: updatedTeam?.name,
        city: updatedTeam?.city,
        players: [], // Players are not updated here
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Team not found" };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to update team", error: error.message };
  }
};