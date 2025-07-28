import { Team } from './team.ts';
import { Match } from './match.ts';

export interface Tournament {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    zipCode: string;
  };
  date: Date;
  teams: Team[];
  matches: Match[];
}
