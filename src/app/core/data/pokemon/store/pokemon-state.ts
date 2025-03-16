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
  pokemonList: PokemonListResponse | null;
  /** Currently selected pokemon with detailed information */
  selectedPokemon: Pokemon | null;
  /** Flag indicating if a request is in progress */
  loading: boolean;
  /** Error message if any request fails */
  error: string | null;
}


@State<PokemonStateModel>({
  name: 'pokemon',
  defaults: {
    pokemonList: null,
    selectedPokemon: null,
    loading: false,
    error: null
  }
})
@Injectable()
export class PokemonState {
  constructor(private pokemonService: PokemonService) {}

  /**
   * Selects and transforms the pokemon list from the state
   * @param state The current pokemon state
   * @returns Transformed pokemon list with name and extracted number from URL
   */
  @Selector()
  static getPokemonList(state: PokemonStateModel) {
    return state.pokemonList?.results
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
    return state.loading;
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
  fetchPokemonList(ctx: StateContext<PokemonStateModel>, action: FetchPokemonList) {
    const state = ctx.getState();
    ctx.patchState({
      loading: true,
      error: null
    });

    return this.pokemonService.getPokemonList(action.limit, action.offset).pipe(
      tap(response => {
        console.log(response);
        ctx.patchState({
          pokemonList: response,
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          error: error.message,
          loading: false
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
  fetchPokemonDetails(ctx: StateContext<PokemonStateModel>, action: FetchPokemonDetails) {
    const state = ctx.getState();
    ctx.patchState({
      loading: true,
      error: null
    });

    return this.pokemonService.getPokemonDetails(action.nameOrId).pipe(
      tap(pokemon => {
        ctx.patchState({
          selectedPokemon: pokemon,
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          error: error.message,
          loading: false
        });
        return of(error);
      })
    );
  }
}