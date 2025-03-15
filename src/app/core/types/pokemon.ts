import { PokemonAbility } from "./ability";
import { PokemonMove } from "./move";
import { NamedAPIResource } from "./resource";
import { PokemonSprites } from "./sprites";
import { PokemonStat } from "./stat";
import { PokemonType } from "./type";

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  location_area_encounters: string;
  moves: PokemonMove[];
  sprites: PokemonSprites;
  species: NamedAPIResource;
  stats: PokemonStat[];
  types: PokemonType[];
  past_types?: {
    generation: NamedAPIResource;
    types: PokemonType[];
  }[];
}