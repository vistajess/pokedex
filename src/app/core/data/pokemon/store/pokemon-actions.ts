import { PokemonFilters } from "../types/pokemon-filters";

// Actions
export class LoadPokemons {
  static readonly type = '[Pokemon] Load Pokemon';
  constructor(public payload: { batchSize: number }) {}
}

export class FetchFilteredPokemon {
  static readonly type = '[Pokemon] Fetch Filtered Pokemon';
  constructor(public payload: { limit: number, offset: number, filters?: PokemonFilters }) {}
}

export class SetFilters {
  static readonly type = '[Pokemon] Set Filters';
  constructor(public payload: PokemonFilters) {}
}

export class ApplyFilters {
  static readonly type = '[Pokemon] Apply Filters';
}
