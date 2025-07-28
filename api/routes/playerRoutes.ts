import { Router } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import { getPlayerById, createPlayer, updatePlayer } from "../controllers/playerController.ts";

const router = new Router();

router.get("/joueur/:id", getPlayerById);
router.post("/joueur", createPlayer);
router.put("/joueur/:id", updatePlayer);

export default router;
