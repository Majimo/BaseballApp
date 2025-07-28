import { Router } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import { getTeams, getTeamById, createTeam, updateTeam } from "../controllers/teamController.ts";

const router = new Router();

router.get("/equipe", getTeams);
router.get("/equipe/:id", getTeamById);
router.post("/equipe", createTeam);
router.put("/equipe/:id", updateTeam);

export default router;
