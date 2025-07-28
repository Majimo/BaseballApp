import { Player } from './player.ts';

export interface Team {
  id: string;
  name: string;
  city: string;
  players: Player[];
}
