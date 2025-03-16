import { Injectable } from "@angular/core";
import { PokemonListResponse } from "../types";
import { Observable } from "rxjs";
import { Pokemon } from "src/app/core/types";
import { HttpClient } from "@angular/common/http";
import { POKEMON_API } from '../constants/api.constants';

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
  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated list of Pokemon
   * @param limit - The maximum number of Pokemon to return (default: 20)
   * @param offset - The offset position in the Pokemon list (default: 0)
   * @returns An Observable of PokemonListResponse containing the paginated results
   */
  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.baseUrl}${POKEMON_API.ENDPOINTS.POKEMON}?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Fetches detailed information about a specific Pokemon
   * @param nameOrId - The name or ID of the Pokemon to fetch
   * @returns An Observable of Pokemon containing the detailed Pokemon data
   */
  getPokemonDetails(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${nameOrId}`);
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