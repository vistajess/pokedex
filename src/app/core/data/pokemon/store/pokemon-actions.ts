import { PokemonFilters } from "../types/pokemon-filters";

// Actions
/**
 * Loads the pokemons
 */
export class LoadPokemons {
  static readonly type = '[Pokemon] Load Pokemon';
  constructor(public payload: { batchSize: number }) {}
}

/**
 * Opens the AI search for pokemon
 */
export class OpenAISearchPokemon {
  static readonly type = '[Pokemon] OpenAI Search Pokemon';
  constructor(public payload: { search: string }) {}
}

/**
 * Opens the AI search for pokemon success
 */
export class OpenAISearchPokemonSuccess {
  static readonly type = '[Pokemon] OpenAI Search Pokemon Success';
  constructor(public payload: any) {}
}

/**
 * Opens the AI search for pokemon failure
 */
export class OpenAISearchPokemonFailure {
  static readonly type = '[Pokemon] OpenAI Search Pokemon Failure';
  constructor(public error: any) {}
}

/**
 * Sets the filters
 */
export class SetFilters {
  static readonly type = '[Pokemon] Set Filters';
  constructor(public payload: PokemonFilters) {}
}

/**
 * Applies the filters
 */
export class ApplyFilters {
  static readonly type = '[Pokemon] Apply Filters';
}
