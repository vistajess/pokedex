import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { Pokemon, PokemonStatEnum } from "src/app/core/types";
import { IndexedDBService } from "../helpers/services/indexed-db.service";
import { PokemonService } from "../services";
import { ApplyFilters, LoadPokemons, OpenAISearchPokemon, OpenAISearchPokemonFailure, OpenAISearchPokemonSuccess, SetFilters } from "./pokemon-actions";
import { defaultPokemonState, PokemonStateModel } from "./pokemon-state-model";
import { categorizeHeight } from "../helpers/pokemon-height";
import { hasValue } from "src/app/shared/helpers/object.helper";
import { OPENAI_NO_RESULTS_PROMPT, OpenAIService } from "src/app/core/services/openai.service";


@State<PokemonStateModel>({
  name: 'pokemon',
  defaults: defaultPokemonState
})
@Injectable()
export class PokemonState {
  constructor(
    private pokemonService: PokemonService,
    private indexedDBService: IndexedDBService,
    private openaiService: OpenAIService
  ) { }

  /**
 * Loads a batch of pokemons from the API and caches them in IndexedDB.
 * If the pokemons are already cached, it loads them from the cache instead.
 * @param ctx The state context
 * @param payload The action payload containing the batch size
 */
  @Action(LoadPokemons)
  async loadPokemons(ctx: StateContext<PokemonStateModel>, { payload }: LoadPokemons) {
    ctx.patchState({ isLoading: true });
    const { batchSize } = payload;
    const cachedData = await this.indexedDBService.get<Pokemon[]>('pokemonList');
    const totalPokemons = 1000; // total pokemons to load

    if (cachedData && cachedData.length >= totalPokemons) {
      ctx.patchState({ pokemons: cachedData, totalLoaded: cachedData.length, isMaxPokemonsLoaded: true, isLoading: false, isBatchLoading: false });
      return;
    }

    const pokemonMap = new Map((cachedData || []).map((p: any) => [p.name, p]));
    ctx.patchState({ isLoading: true, isBatchLoading: true });

    for (let offset = 0; offset < totalPokemons; offset += batchSize) {
      const batch = await this.pokemonService.getPokemonList(batchSize, offset).toPromise();

      const detailRequests = batch?.results.map((pokemon: Pokemon) =>
        this.pokemonService.getPokemonDetails(pokemon.name).pipe(
          map((details) => ({ ...pokemon, details }))
        )
      );

      const batchWithDetails = await forkJoin(detailRequests || []).toPromise();
      batchWithDetails?.forEach((pokemon: Pokemon) => pokemonMap.set(pokemon.name, pokemon));

      const mergedData = Array.from(pokemonMap.values());
      await this.indexedDBService.set('pokemonList', mergedData);

      ctx.patchState({
        pokemons: mergedData as Pokemon[],
        totalLoaded: mergedData.length
      });

      await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay for API-friendly batching
    }

    ctx.patchState({ isLoading: false, isBatchLoading: false, isMaxPokemonsLoaded: true });

  }

  @Action(OpenAISearchPokemon)
  async openAISearchPokemon(ctx: StateContext<PokemonStateModel>, { payload }: OpenAISearchPokemon) {
    ctx.patchState({ isLoading: true });
    const { filters } = ctx.getState();
    const { search } = payload;

    try {
      const openAIResponse = await this.openaiService.interpretDescription(search);
      if (openAIResponse === OPENAI_NO_RESULTS_PROMPT) {
        ctx.patchState({ isLoading: false, filters: { ...filters, search: [...search] } });
        return;
      } else {
        const arrayOfPokemonNames = openAIResponse.split(',');
        ctx.dispatch(new OpenAISearchPokemonSuccess({ search: arrayOfPokemonNames }));
      }
    } catch (error: any) {
      ctx.dispatch(new OpenAISearchPokemonFailure({ error: error }));
    }
  }

  @Action(OpenAISearchPokemonSuccess)
  openAISearchPokemonSuccess(ctx: StateContext<PokemonStateModel>, { payload }: OpenAISearchPokemonSuccess) {
    const { filters } = ctx.getState();
    const { search } = payload;
    const hasSearch = search.length > 0;
    ctx.patchState({ 
      isLoading: hasSearch,
      filters: { ...filters, search: hasSearch ? [...search] : [] },
      error: null,
      hasError: false 
    });
    ctx.dispatch(new SetFilters({ ...filters, search: hasSearch ? [...search] : [] }));
  }

  @Action(OpenAISearchPokemonFailure)
  openAISearchPokemonFailure(ctx: StateContext<PokemonStateModel>, { error }: OpenAISearchPokemonFailure) {
    const { filters } = ctx.getState();

    ctx.patchState({ isLoading: false, filters: { ...filters, }, error, hasError: true });
  }

  /**
   * Sets the filters in the state.
   * @param ctx The state context
   * @param payload The action payload containing the filters to set
   */
  @Action(SetFilters)
  setFilters(ctx: StateContext<PokemonStateModel>, { payload }: SetFilters) {
    const { filters } = ctx.getState();
    ctx.patchState({ filters: { ...filters, ...payload } });
    ctx.dispatch(new ApplyFilters());
  }

  /**
   * Applies the filters to the pokemons in the state.
   * @param ctx The state context
   */
  @Action(ApplyFilters)
  applyFilters(ctx: StateContext<PokemonStateModel>) {
    const state = ctx.getState();
    const { pokemons, filters } = state;

    const filteredPokemons = pokemons.filter((pokemon: Pokemon) => {
      const matchesType = filters.type ? pokemon.details?.types.some((t: any) => t.type.name === filters.type) : true;

      // check the height category
      const matchesHeight = filters.heightCategory
        ? filters.heightCategory.includes(categorizeHeight(pokemon.details?.height ?? 0))
        : true;

      // check the search
      const matchesSearch = filters.search
        ? filters.search.some((s: string) => pokemon.name.toLowerCase().includes(s.toLowerCase()))
        : true;

      // get stats based on the pokemon details
      const hp = pokemon.details?.stats.find((stat) => stat.stat.name === PokemonStatEnum.HP)?.base_stat || 0;
      const attack = pokemon.details?.stats.find((stat) => stat.stat.name === PokemonStatEnum.ATTACK)?.base_stat || 0;
      const defense = pokemon.details?.stats.find((stat) => stat.stat.name === PokemonStatEnum.DEFENSE)?.base_stat || 0;
      const speed = pokemon.details?.stats.find((stat) => stat.stat.name === PokemonStatEnum.SPEED)?.base_stat || 0;

      // check if the stats are not zero
      // make sure the stats are not zero before applying the filters
      const hasNonZeroStats = hasValue(filters.stats) &&
        hasValue(filters.stats?.hp) &&
        hasValue(filters.stats?.attack) &&
        hasValue(filters.stats?.defense) &&
        hasValue(filters.stats?.speed);

      // Add the matchesStats condition
      const matchesStats = filters.stats && hasNonZeroStats
        ? (filters.stats.hp ? hp >= filters.stats.hp : true) &&
        (filters.stats.attack ? attack >= filters.stats.attack : true) &&
        (filters.stats.defense ? defense >= filters.stats.defense : true) &&
        (filters.stats.speed ? speed >= filters.stats.speed : true)
        : true;

      return matchesType && matchesHeight && matchesSearch && matchesStats;
    });

    ctx.patchState({ filteredPokemons, isLoading: false, hasError: false, error: null });
  }

}