import { Inject, Injectable } from "@angular/core";
import { PokemonListResponse } from "../types";
import { from, map, Observable } from "rxjs";
import { Pokemon, PokemonDetail } from "src/app/core/types";
import { HttpClient } from "@angular/common/http";
import { POKEMON_API } from '../constants/api.constants';
import { QueryClientService } from "src/app/core/query/query-client.service";
import { POKEMON_QUERY_CLIENT, QUERY_CLIENT_SERVICE } from "src/app/core/query/query-client.token";
import { QueryClient } from "@tanstack/query-core";

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
  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    return from(
      this.queryClient.fetchQuery({
        queryKey: ['pokemonList', offset, limit],
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
}