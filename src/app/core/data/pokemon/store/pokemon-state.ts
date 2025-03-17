import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { PokemonDetail } from "src/app/core/types";
import { PokemonService } from "../services";
import { FetchPokemonDetail, FetchPokemonDetailFail, FetchPokemonDetailSuccess, FetchPokemonList } from "./pokemon-actions";
import { defaultPokemonState, PokemonStateModel } from "./pokemon-state-model";


@State<PokemonStateModel>({
  name: 'pokemon',
  defaults: defaultPokemonState
})
@Injectable()
export class PokemonState {
  constructor(private pokemonService: PokemonService) { }

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
  @Action(FetchPokemonDetail)
  fetchPokemonDetails(ctx: StateContext<PokemonStateModel>, { payload }: FetchPokemonDetail) {
    const state = ctx.getState();

    if (state.loadingDetails.includes(payload.id)) {
      console.log('Not fetching more Pokémon: already loading or no more Pokémon');
      return;
    }

    ctx.patchState({
      loadingDetails: [...state.loadingDetails, payload.id]
    });

    return this.pokemonService.getPokemonDetails(payload.id).pipe(
      tap((detail: PokemonDetail) => {
        ctx.dispatch(new FetchPokemonDetailSuccess({ detail }));
      }),
      catchError(error => {
        ctx.dispatch(new FetchPokemonDetailFail({ error }));
        return throwError(() => error);
      })
    );
  }

  @Action(FetchPokemonDetailSuccess)
  fetchPokemonDetailSuccess(ctx: StateContext<PokemonStateModel>, action: FetchPokemonDetailSuccess) {
    const state = ctx.getState();
    const { detail } = action.payload;
    
    ctx.patchState({
      details: {
        ...state.details,
        [detail.name]: detail
      },
      loadingDetails: state.loadingDetails.filter(id => id !== detail.id.toString())
    });
  }

  @Action(FetchPokemonDetailFail)
  fetchPokemonDetailFail(ctx: StateContext<PokemonStateModel>, action: FetchPokemonDetailFail) {
    const state = ctx.getState();
    const { error } = action.payload;
    
    ctx.patchState({
      detailsError: error,
      // We don't know which ID failed, so we can't remove it from loadingDetails
      // In a real app, you might want to include the ID in the error payload
    });
  }
}