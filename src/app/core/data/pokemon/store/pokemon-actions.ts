import { PokemonDetail } from "src/app/core/types";

// Actions
export class FetchPokemonList {
  static readonly type = '[Pokemon] Fetch Pokemon List';
  constructor(public payload: { limit: number, offset: number }) { }
}
export class FetchPokemonDetail {
  static readonly type = '[Pokemon] Fetch Pokemon Detail';
  constructor(public payload: { id: string }) {}
}

export class FetchPokemonDetailSuccess {
  static readonly type = '[Pokemon] Fetch Pokemon Detail Success';
  constructor(public payload: { detail: PokemonDetail }) {}
}

export class FetchPokemonDetailFail {
  static readonly type = '[Pokemon] Fetch Pokemon Detail Fail';
  constructor(public payload: { error: any }) {}
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