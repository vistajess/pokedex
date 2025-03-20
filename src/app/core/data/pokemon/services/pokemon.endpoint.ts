import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { QueryClient } from "@tanstack/query-core";
import { from, map, Observable } from "rxjs";
import { POKEMON_QUERY_CLIENT } from "src/app/core/query/query-client.token";
import { Pokemon, PokemonDetail, PokemonSpeciesDetail } from "src/app/core/types";
import { POKEMON_API } from '../constants/api.constants';
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
  getPokemonSpecies(nameOrId: string | number): Observable<PokemonSpeciesDetail> {
    return from(
      this.queryClient.fetchQuery({
        queryKey: ['pokemonSpecies', nameOrId],
        queryFn: () => this.http.get<PokemonSpeciesDetail>(`${this.baseUrl}${POKEMON_API.ENDPOINTS.POKEMON_SPECIES}/${nameOrId}`).toPromise(),
      })
    ).pipe(
      map(species => {
        if (!species) {
          throw new Error(`Species with id ${nameOrId} not found`);
        }
        return species;
      })
    );
  }

  /**
   * Fetches information about a specific Pokemon type
   * @param nameOrId - The name or ID of the type to fetch
   * @returns An Observable containing the type data and Pokemon of that type
   */
  getPokemonByType(nameOrId: string | number): Observable<any> {
    return from(
      this.queryClient.fetchQuery({
        queryKey: ['pokemonByType', nameOrId],
        queryFn: () => this.http.get<any>(`${this.baseUrl}${POKEMON_API.ENDPOINTS.TYPES}/${nameOrId}`).toPromise(),
      })
    ).pipe(
      map(type => {
        if (!type) {
          throw new Error(`Type with id ${nameOrId} not found`);
        }
        return type;
      })
    );
  }

  /**
   * Fetches information about a specific Pokemon ability
   * @param url - The URL of the ability to fetch
   * @returns An Observable containing the ability data
   */
  getPokemonAbilityByUrl(url: string): Observable<any> {
    return from(
      this.queryClient.fetchQuery({
        queryKey: ['pokemonAbility', url],
        queryFn: () => this.http.get<any>(url).toPromise(),
      })
    ).pipe(
      map(ability => {
        if (!ability) {
          throw new Error(`Ability with url ${url} not found`);
        }
        return ability;
      })
    );
  }

  /**
   * Fetches the evolution chain for a specific Pokemon
   * @param url - The URL of the evolution chain to fetch
   * @returns An Observable containing the evolution chain data
   */
  getEvolutionChain(url: string): Observable<any> {
    return from(
      this.queryClient.fetchQuery({
        queryKey: ['evolutionChain', url],
        queryFn: () => this.http.get<any>(url).toPromise(),
      })
    ).pipe(
      map(evolutionChain => {
        if (!evolutionChain) {
          throw new Error(`Evolution chain with url ${url} not found`);
        }
        return evolutionChain;
      })
    );
  }
}