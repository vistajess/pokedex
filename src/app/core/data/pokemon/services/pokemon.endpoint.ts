import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { QueryClient } from "@tanstack/query-core";
import { from, map, Observable, switchMap } from "rxjs";
import { POKEMON_QUERY_CLIENT } from "src/app/core/query/query-client.token";
import { Pokemon, PokemonDetail, PokemonRarityEnum, PokemonSpeciesDetail } from "src/app/core/types";
import { POKEMON_API } from '../constants/api.constants';
import { categorizeHeight } from "../helpers/pokemon-height";
import { PokemonListResponse } from "../types";
import { PokemonFilters } from "../types/pokemon-filters";

/**
 * Service for making HTTP requests to the Pokemon API
 */
@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  /** Base URL for the Pokemon API */
  private baseUrl = POKEMON_API.BASE_URL;

  /**
   * Creates an instance of PokemonService
   * @param http - The HttpClient for making API requests
   */
  constructor(
    private http: HttpClient,
    @Inject(POKEMON_QUERY_CLIENT) private queryClient: QueryClient
  ) { }

  /**
   * Fetches a paginated list of Pokemon
   * @param limit - The maximum number of Pokemon to return (default: 20)
   * @param offset - The offset position in the Pokemon list (default: 0)
   * @returns An Observable of PokemonListResponse containing the paginated results
   */
  getPokemonList(limit: number = 20, offset: number = 0, filters?: PokemonFilters): Observable<PokemonListResponse> {
    return from(
      this.queryClient.fetchQuery({
        queryKey: ['pokemonList', limit, offset, filters],
        queryFn: () => this.http.get<PokemonListResponse>(`${this.baseUrl}${POKEMON_API.ENDPOINTS.POKEMON}?limit=${limit}&offset=${offset}`).toPromise(),
      })
    ).pipe(
      map(response => {
        if (!response) {
          throw new Error(`Failed to fetch Pokemon list with offset ${offset} and limit ${limit}`);
        }
        return response as PokemonListResponse;
      })
    );
  }

  /**
   * Fetches detailed information about a specific Pokemon
   * @param nameOrId - The name or ID of the Pokemon to fetch
   * @returns An Observable of Pokemon containing the detailed Pokemon data
   */
  getPokemonDetails(nameOrId: string | number): Observable<PokemonDetail> {
    return from(
      this.queryClient.fetchQuery({
        queryKey: ['pokemonDetails', nameOrId],
        queryFn: () => this.http.get<Pokemon>(`${this.baseUrl}${POKEMON_API.ENDPOINTS.POKEMON}/${nameOrId}`).toPromise(),
      })
    ).pipe(
      map(pokemon => {
        if (!pokemon) {
          throw new Error(`Pokemon with id ${nameOrId} not found`);
        }
        return pokemon as PokemonDetail;
      })
    );
  }

  /**
   * Fetches Pokemon species information including evolution chain
   * @param nameOrId - The name or ID of the Pokemon species to fetch
   * @returns An Observable containing the Pokemon species data
   */
  getPokemonSpecies(nameOrId: string | number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}${POKEMON_API.ENDPOINTS.POKEMON_SPECIES}/${nameOrId}`
    );
  }

  /**
   * Fetches information about a specific Pokemon type
   * @param nameOrId - The name or ID of the type to fetch
   * @returns An Observable containing the type data and Pokemon of that type
   */
  getPokemonByType(nameOrId: string | number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}${POKEMON_API.ENDPOINTS.TYPES}/${nameOrId}`
    );
  }

  /**
   * Fetches and filters Pokemon based on specified criteria including height category
   * @param filters - Object containing filter criteria
   * @param limit - Maximum number of Pokemon to check before filtering (default: 100)
   * @returns Observable of filtered Pokemon details
   */
  getFilteredPokemon(
    filters: PokemonFilters,
    limit: number = 100
  ): Observable<PokemonDetail[]> {
    // First get the list of Pokemon
    return this.getPokemonList(limit, 100, filters).pipe(
      // Get the results array from the response
      map(response => response.results),
      // Map each Pokemon to its details observable
      map(pokemonList => {
        return pokemonList.map(pokemon => 
          this.getPokemonDetails(pokemon.name)
        );
      }),
      // Convert array of observables to single observable of array
      switchMap(detailObservables => 
        from(Promise.all(detailObservables.map(obs => 
          new Promise<PokemonDetail>(resolve => {
            obs.subscribe(detail => resolve(detail));
          })
        )))
      ),
      // Apply the filters to the Pokemon details
      map(pokemonDetails => pokemonDetails.filter(async (pokemon) => {
        // Apply type filter if specified
        if (filters.type && !pokemon.types.some(t => 
          t.type.name.toLowerCase() === filters.type?.toLowerCase())) {
          return false;
        }
        
        // Apply height category filter if specified
        if (filters.heightCategory && 
            !filters.heightCategory.includes(categorizeHeight(pokemon.height))) {
          return false;
        }
        
        // Apply rarity filter if specified
        if (filters.rarity) {
          const speciesDetails = await this.getPokemonSpeciesDetails(pokemon.id).toPromise();
          // const encounterLocations = await this.getPokemonEncounterLocations(pokemon.id).toPromise();

          const isLegendary = speciesDetails?.is_legendary;
          const isMythical = speciesDetails?.is_mythical;
          const baseExperience = pokemon.base_experience;
          // const encounterLocationCount = encounterLocations.length;

          switch (filters.rarity) {
            case PokemonRarityEnum.COMMON:
              if (baseExperience < 100) return true;
              break;
            case PokemonRarityEnum.UNCOMMON:
              if (baseExperience >= 100 && baseExperience < 200) return true;
              break;
            case PokemonRarityEnum.RARE:
              if (baseExperience >= 200) return true;
              break;
            case PokemonRarityEnum.LEGENDARY:
              if (isLegendary) return true;
              break;
            case PokemonRarityEnum.MYTHICAL:
              if (isMythical) return true;
              break;
          }

          return false;
        }
        return true;
      }))
    );
  }

  getPokemonSpeciesDetails(id: number): Observable<PokemonSpeciesDetail> {
    return this.http.get<PokemonSpeciesDetail>(`${this.baseUrl}/pokemon-species/${id}`);
  }
}