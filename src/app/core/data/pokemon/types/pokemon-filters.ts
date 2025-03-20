import { PokemonTypeEnum } from "src/app/core/types";
import { HeightCategory } from "../helpers/pokemon-height";

export interface PokemonFilters {
  type?: PokemonTypeEnum | null ;
  heightCategory?: HeightCategory | null;
  search?: string[];
  stats?: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  }
}   