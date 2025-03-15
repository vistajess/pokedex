import { NamedAPIResource } from "./resource";

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export enum PokemonStatEnum {
  HP = "hp",
  ATTACK = "attack",
  DEFENSE = "defense",
  SPECIAL_ATTACK = "special-attack",
  SPECIAL_DEFENSE = "special-defense",
  SPEED = "speed"
}