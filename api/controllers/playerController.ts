import { RouterContext } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import { Player } from "../models/player.ts";
import { db } from "../db/database.ts";

export const getPlayerById = async (ctx: RouterContext) => {
  const { id } = ctx.params;
  try {
    const player = await db.selectFrom('players').where('id', '=', id).selectAll().executeTakeFirst();
    if (player) {
      ctx.response.body = {
        id: player.id,
        firstName: player.first_name,
        lastName: player.last_name,
        jerseyNumber: player.jersey_number,
        birthDate: new Date(player.birth_date),
        teamId: player.team_id,
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Player not found" };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to fetch player", error: error.message };
  }
};

export const createPlayer = async (ctx: RouterContext) => {
  try {
    const body = await ctx.request.body().value;
    const newPlayerId = crypto.randomUUID();
    const newPlayer: Player = {
      id: newPlayerId,
      firstName: body.firstName,
      lastName: body.lastName,
      jerseyNumber: body.jerseyNumber,
      birthDate: new Date(body.birthDate),
      teamId: body.teamId,
    };
    await db.insertInto('players').values({
      id: newPlayer.id,
      first_name: newPlayer.firstName,
      last_name: newPlayer.lastName,
      jersey_number: newPlayer.jerseyNumber,
      birth_date: newPlayer.birthDate.toISOString().split('T')[0],
      team_id: newPlayer.teamId,
    }).execute();
    ctx.response.status = 201;
    ctx.response.body = newPlayer;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to create player", error: error.message };
  }
};

export const updatePlayer = async (ctx: RouterContext) => {
  const { id } = ctx.params;
  try {
    const body = await ctx.request.body().value;
    const updatedData: Record<string, unknown> = {
      first_name: body.firstName,
      last_name: body.lastName,
      jersey_number: body.jerseyNumber,
      birth_date: new Date(body.birthDate).toISOString().split('T')[0],
      team_id: body.teamId,
    };
    const result = await db.updateTable('players').set(updatedData).where('id', '=', id).executeTakeFirst();

    if (result?.numUpdatedRows && result.numUpdatedRows > 0) {
      const updatedPlayer = await db.selectFrom('players').where('id', '=', id).selectAll().executeTakeFirst();
      ctx.response.body = {
        id: updatedPlayer?.id,
        firstName: updatedPlayer?.first_name,
        lastName: updatedPlayer?.last_name,
        jerseyNumber: updatedPlayer?.jersey_number,
        birthDate: new Date(updatedPlayer?.birth_date || ''),
        teamId: updatedPlayer?.team_id,
      };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Player not found" };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Failed to update player", error: error.message };
  }
};
