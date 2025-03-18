import { PokemonRarityEnum } from "src/app/core/types";

import { PokemonTypeEnum } from "src/app/core/types";
import { HeightCategory } from "../helpers/pokemon-height";

export interface PokemonFilters {
  type?: PokemonTypeEnum;
  rarity?: PokemonRarityEnum;
  heightCategory?: HeightCategory[];
  search?: string;
}   