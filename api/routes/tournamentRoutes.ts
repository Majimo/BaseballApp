import { Router } from "https://deno.land/x/oak@v17.1.5/mod.ts";
import { 
    getTournaments, 
    getTournamentById, 
    createTournament, 
    updateTournament,
    getTournamentMatches,
    addTournamentMatch,
    updateTournamentMatch
} from "../controllers/tournamentController.ts";

const router = new Router();

router.get("/tournoi", getTournaments);
router.get("/tournoi/:id", getTournamentById);
router.post("/tournoi", createTournament);
router.put("/tournoi/:id", updateTournament);
router.get("/tournoi/:id/match", getTournamentMatches);
router.post("/tournoi/:id/match", addTournamentMatch);
router.put("/tournoi/:id/match/:idMatch", updateTournamentMatch);

export default router;