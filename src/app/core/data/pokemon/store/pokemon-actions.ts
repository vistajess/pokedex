// Actions
export class FetchPokemonList {
  static readonly type = '[Pokemon] Fetch Pokemon List';
  constructor(public limit: number = 20, public offset: number = 0) { }
}

export class FetchPokemonDetails {
  static readonly type = '[Pokemon] Fetch Pokemon Details';
  constructor(public nameOrId: string | number) { }
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