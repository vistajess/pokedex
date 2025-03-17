import { Selector } from '@ngxs/store';
import { PokemonStateModel } from './pokemon-state-model';
import { NamedAPIResource } from 'src/app/core/types';
import { PokemonState } from './pokemon-state';

export class PokemonSelectors {
  /**
   * Selects and transforms the pokemon list from the state
   */
  @Selector([PokemonState])
  static getPokemonList(state: PokemonStateModel) {
    return state.pokemonResponseList?.results
      .map((pokemon: NamedAPIResource) => {
        return {
          ...pokemon,
          name: pokemon.name,
          number: Number(pokemon.url.split("/").filter(Boolean).pop())
        }
      });
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
  static hasMorePokemon(state: PokemonStateModel): boolean {
    return state.hasMorePokemon;
  }

  @Selector([PokemonState])
  static getPokemonDetails(state: PokemonStateModel) {
    return state.details;
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