// Actions
export class FetchPokemonList {
  static readonly type = '[Pokemon] Fetch Pokemon List';
  constructor(public payload: { limit: number, offset: number }) { }
}

export class FetchPokemonDetails {
  static readonly type = '[Pokemon] Fetch Pokemon Details';
  constructor(public payload: { nameOrId: string }) { }
}

/**
 * Action types for Pokemon-related operations
 */
export enum PokemonActionTypes {
  /**
   * Action type for loading Pokemon data
   */
  LOAD_POKEMONS = '[Pokemon] Load Pokemons',
  
  /**
   * Action type for selecting a specific Pokemon
   */
  SELECT_POKEMON = '[Pokemon] Select Pokemon',
}