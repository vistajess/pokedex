import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { Pokemon } from "src/app/core/types";
import { IndexedDBService } from "../helpers/services/indexed-db.service";
import { PokemonService } from "../services";
import { ApplyFilters, LoadPokemons, SetFilters } from "./pokemon-actions";
import { defaultPokemonState, PokemonStateModel } from "./pokemon-state-model";
import { categorizeHeight } from "../helpers/pokemon-height";


@State<PokemonStateModel>({
  name: 'pokemon',
  defaults: defaultPokemonState
})
@Injectable()
export class PokemonState {
  constructor(private pokemonService: PokemonService, private indexedDBService: IndexedDBService) { }

  @Action(LoadPokemons)
  async loadPokemons(ctx: StateContext<PokemonStateModel>, { payload }: LoadPokemons) {
    const { batchSize } = payload;
    const cachedData = await this.indexedDBService.get<Pokemon[]>('pokemonList');
    const totalPokemons = 1000; // total pokemons to load

    if (cachedData && cachedData.length >= totalPokemons) {
      ctx.patchState({ pokemons: cachedData, totalLoaded: cachedData.length, isLoading: false });
      return;
    }

    const pokemonMap = new Map((cachedData || []).map((p: any) => [p.name, p]));
    ctx.patchState({ isLoading: true });

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

    ctx.patchState({ isLoading: false });

  }


  @Action(SetFilters)
  setFilters(ctx: StateContext<PokemonStateModel>, { payload }: SetFilters) {
    const { filters } = ctx.getState();
    console.log('filters', { ...filters, ...payload } );
    ctx.patchState({ filters: { ...filters, ...payload } });
    ctx.dispatch(new ApplyFilters());
  }

  @Action(ApplyFilters)
  applyFilters(ctx: StateContext<PokemonStateModel>) {
    const state = ctx.getState();
    const { pokemons, filters } = state;

    const filteredPokemons = pokemons.filter((pokemon) => {
      const matchesType = filters.type ? pokemon.details?.types.some((t: any) => t.type.name === filters.type) : true;
      // const matchesRarity = filters.rarity ? pokemon.details?.rarity === filters.rarity : true;
      const matchesHeight = filters.heightCategory
        ? filters.heightCategory.includes(categorizeHeight(pokemon.details?.height ?? 0))
        : true;
        if (pokemon.name  === 'clefairy') {
          console.log('CLEFAIRYpokemon', pokemon.details?.height);
          console.log(filters.heightCategory)
          console.log(categorizeHeight(pokemon.details?.height ?? 0))
        }
      const matchesSearch = filters.search
        ? pokemon.name.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      return matchesType && matchesHeight && matchesSearch;
    });

    console.log('filteredPokemons', filteredPokemons);

    ctx.patchState({ filteredPokemons });
  }

}