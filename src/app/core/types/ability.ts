import { NamedAPIResource } from "./resource";

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface AbilityDetail {
  id: number;
  name: string;
  effect_entries: { effect: string; language: NamedAPIResource }[];
}