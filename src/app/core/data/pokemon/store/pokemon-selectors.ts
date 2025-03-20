import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { Pokemon } from 'src/app/core/types';
import { PokemonFilters } from '../types/pokemon-filters';
import { PokemonState } from './pokemon-state';
import { PokemonStateModel } from './pokemon-state-model';
@State<PokemonStateModel>({
  name: 'pokemon'
})
@Injectable()
export class PokemonSelectors {
  /**
   * Selects and transforms the pokemon list from the state
   */
  @Selector()
  static pokemons(state: PokemonStateModel): Pokemon[] {
    return state.pokemons || [];
  }

  /**
   * Selects the filtered pokemons
   */
  @Selector()
  static filteredPokemons(state: PokemonStateModel): Pokemon[] {
    return state.filteredPokemons || [];
  }

  /**
   * Selects the visible pokemons
   */
  @Selector()
  static visiblePokemons(state: PokemonStateModel) {
    return state.filters && Object.values(state.filters).some(val => val)
      ? state.filteredPokemons
      : state.pokemons || [];
  }

  /**
   * Selects the filters
   */
  @Selector()
  static filters(state: PokemonStateModel): PokemonFilters {
    return state.filters || {};
  }

    /**
   * Selects the loading state
   */
    @Selector([PokemonState])
    static isLoading(state: PokemonStateModel) {
      return state.isLoading;
    }
  
  /**
   * Selects the batch loading state
   */
  @Selector([PokemonState])
  static isBatchLoading(state: PokemonStateModel) {
    return state.isBatchLoading;
  }

  /**
   * Selects the total loaded state
   */
  @Selector()
  static totalLoaded(state: PokemonStateModel): number {
    return state.totalLoaded;
  }

  /**
   * Selects the max pokemons loaded state
   */
  @Selector()
  static isMaxPokemonsLoaded(state: PokemonStateModel): boolean {
    return state.isMaxPokemonsLoaded;
  }

  /**
   * Selects the currently selected pokemon from the state
   */
  @Selector([PokemonState])
  static getSelectedPokemon(state: PokemonStateModel) {
    return state.selectedPokemon;
  }

  @Selector([PokemonState])
  static getOffset(state: PokemonStateModel): number {
    return state.offset;
  }

  /**
   * Selects the limit state
   */ 
  @Selector([PokemonState])
  static getLimit(state: PokemonStateModel): number {
    return state.limit;
  }

  /**
   * Selects the pokemon detail by name
   */
  @Selector([PokemonState])
  static getPokemonDetailByName(state: PokemonStateModel) {
    return (name: string) => state.details[name];
  }

  /**
   * Selects the loading detail state
   */
  @Selector([PokemonState])
  static isLoadingDetail(state: PokemonStateModel) {
    return (id: string) => state.loadingDetails.includes(id);
  }

  /**
   * Selects the has error state
   */
  @Selector([PokemonState])
  static hasError(state: PokemonStateModel) {
    return state.hasError;
  }

  /**
   * Selects the error state
   */
  @Selector([PokemonState])
  static getError(state: PokemonStateModel) {
    return state.error;
  }
}