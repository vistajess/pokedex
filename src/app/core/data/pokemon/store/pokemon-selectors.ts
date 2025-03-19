import { Selector, State } from '@ngxs/store';
import { PokemonStateModel } from './pokemon-state-model';
import { NamedAPIResource, Pokemon } from 'src/app/core/types';
import { PokemonState } from './pokemon-state';
import { Injectable } from '@angular/core';
import { PokemonFilters } from '../types/pokemon-filters';
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

  @Selector()
  static filteredPokemons(state: PokemonStateModel): Pokemon[] {
    return state.filteredPokemons || [];
  }

  @Selector()
  static visiblePokemons(state: PokemonStateModel) {
    return state.filters && Object.values(state.filters).some(val => val)
      ? state.filteredPokemons
      : state.pokemons || [];
  }

  @Selector()
  static filters(state: PokemonStateModel): PokemonFilters {
    return state.filters || {};
  }

  @Selector()
  static totalLoaded(state: PokemonStateModel): number {
    return state.totalLoaded;
  }

  /**
   * Selects the currently selected pokemon from the state
   */
  @Selector([PokemonState])
  static getSelectedPokemon(state: PokemonStateModel) {
    return state.selectedPokemon;
  }

  /**
   * Selects the loading state
   */
  @Selector([PokemonState])
  static isLoading(state: PokemonStateModel) {
    return state.isLoading;
  }

  @Selector([PokemonState])
  static getOffset(state: PokemonStateModel): number {
    return state.offset;
  }

  @Selector([PokemonState])
  static getLimit(state: PokemonStateModel): number {
    return state.limit;
  }

  @Selector([PokemonState])
  static getPokemonDetailByName(state: PokemonStateModel) {
    return (name: string) => state.details[name];
  }

  @Selector([PokemonState])
  static isLoadingDetail(state: PokemonStateModel) {
    return (id: string) => state.loadingDetails.includes(id);
  }

  /**
   * Selects the error state
   */
  @Selector([PokemonState])
  static getError(state: PokemonStateModel) {
    return state.error;
  }
}