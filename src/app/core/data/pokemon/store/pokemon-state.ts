import { NamedAPIResource, Pokemon, PokemonAbility } from "src/app/core/types";
import { PokemonListResponse } from "../types";
import { Action, Selector, StateContext } from "@ngxs/store";
import { State } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { PokemonService } from "../services";
import { catchError, tap } from "rxjs/operators";
import { FetchPokemonList, FetchPokemonDetails } from "./pokemon-actions";
import { of } from "rxjs";

/**
 * Interface representing the Pokemon state in the store
 * Contains information about pokemon list, selected pokemon details, loading state and errors
 */
export interface PokemonStateModel {
  /** The list of pokemon with pagination information */
  pokemonResponseList: PokemonListResponse | null;
  /** Currently selected pokemon with detailed information */
  selectedPokemon: Pokemon | null;
  /** Flag indicating if a request is in progress */
  isLoading: boolean;
  /** Error message if any request fails */
  error: string | null;
  offset: number;
  limit: number;
  hasMorePokemon: boolean;
}


@State<PokemonStateModel>({
  name: 'pokemon',
  defaults: {
    pokemonResponseList: null,
    selectedPokemon: null,
    isLoading: false,
    error: null,
    offset: 0,
    limit: 20,
    hasMorePokemon: true
  }
})
@Injectable()
export class PokemonState {
  constructor(private pokemonService: PokemonService) { }

  /**
   * Selects and transforms the pokemon list from the state
   * @param state The current pokemon state
   * @returns Transformed pokemon list with name and extracted number from URL
   */
  @Selector()
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
   * @param state The current pokemon state
   * @returns The selected pokemon details
   */
  @Selector()
  static getSelectedPokemon(state: PokemonStateModel) {
    return state.selectedPokemon;
  }

  /**
   * Selects the loading state
   * @param state The current pokemon state
   * @returns Boolean indicating if a request is in progress
   */
  @Selector()
  static isLoading(state: PokemonStateModel) {
    return state.isLoading;
  }

  @Selector()
  static getOffset(state: PokemonStateModel): number {
    return state.offset;
  }

  @Selector()
  static getLimit(state: PokemonStateModel): number {
    return state.limit;
  }

  @Selector()
  static hasMorePokemon(state: PokemonStateModel): boolean {
    return state.hasMorePokemon;
  }

  /**
   * Selects the error state
   * @param state The current pokemon state
   * @returns Error message if any request has failed
   */
  @Selector()
  static getError(state: PokemonStateModel) {
    return state.error;
  }

  /**
   * Fetches a paginated list of pokemon
   * @param ctx The state context
   * @param action The action containing limit and offset for pagination
   * @returns Observable that completes when the pokemon list is fetched
   */
  @Action(FetchPokemonList)
  fetchPokemonList(ctx: StateContext<PokemonStateModel>, { payload }: FetchPokemonList) {
    const state = ctx.getState();

    // Don't fetch if already loading or no more Pokémon
    if (state.isLoading || !state.hasMorePokemon) {
      console.log('Not fetching more Pokémon: already loading or no more Pokémon');
      return;
    }

    ctx.patchState({
      isLoading: true,
      error: null
    });

    return this.pokemonService.getPokemonList(payload.limit, payload.offset).pipe(
      tap(response => {
        // console.log(response);
        // ctx.patchState({
        //   pokemonList: response,
        //   isLoading: false
        // });
        const currentList = state.pokemonResponseList?.results || [];
        const newList = [...currentList, ...response.results];

        ctx.patchState({  
          pokemonResponseList: {
            ...response,
            results: newList
          },
          offset: state.offset + payload.limit,
          isLoading: false,
          hasMorePokemon: response.results.length > 0
        });
      }),
      catchError(error => {
        console.error('Error fetching Pokemon list:', error);
        ctx.patchState({
          error: error.message,
          isLoading: false
        });
        return of(error);
      })
    );
  }

  /**
   * Fetches detailed information for a specific pokemon
   * @param ctx The state context
   * @param action The action containing the name or ID of the pokemon to fetch
   * @returns Observable that completes when the pokemon details are fetched
   */
  @Action(FetchPokemonDetails)
  fetchPokemonDetails(ctx: StateContext<PokemonStateModel>, { payload }: FetchPokemonDetails) {
    const state = ctx.getState();
    ctx.patchState({
      isLoading: true,
      error: null
    });

    return this.pokemonService.getPokemonDetails(payload.nameOrId).pipe(
      tap(pokemon => {
        ctx.patchState({
          selectedPokemon: pokemon,
          isLoading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          error: error.message,
          isLoading: false
        });
        return of(error);
      })
    );
  }
}