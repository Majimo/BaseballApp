import { Team } from "../models/team.ts";
import { Match } from "../models/match.ts";

class TournamentService {
  generateMatches(teams: Team[]): Omit<Match, 'id' | 'tournamentId' | 'score'>[] {
    const matches: Omit<Match, 'id' | 'tournamentId' | 'score'>[] = [];
    const teamsCopy = [...teams];

    if (teamsCopy.length % 2 !== 0) {
      teamsCopy.push({ id: "bye", name: "Bye", city: "", players: [] });
    }

    const numTeams = teamsCopy.length;
    const rounds = numTeams - 1;
    const matchesPerRound = numTeams / 2;

    for (let round = 0; round < rounds; round++) {
      for (let match = 0; match < matchesPerRound; match++) {
        const team1 = teamsCopy[match];
        const team2 = teamsCopy[numTeams - 1 - match];

        if (team1.id !== "bye" && team2.id !== "bye") {
          matches.push({
            team1Id: team1.id,
            team2Id: team2.id,
            date: new Date(), 
            time: "10:00", 
          });
        }
      }

      teamsCopy.splice(1, 0, teamsCopy.pop()!); 
    }

    return matches;
  }
}

export default new TournamentService();