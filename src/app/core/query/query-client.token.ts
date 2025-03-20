import { InjectionToken } from '@angular/core';
import { QueryClient } from '@tanstack/query-core';

/**
 * Interface representing a QueryClient service
 * Contains a queryClient property
 */
interface QueryClientService {
  queryClient: QueryClient;
}

/**
 * Injection token for the QueryClient service
 * Used to inject the QueryClient service into a component or service
 */
export const QUERY_CLIENT_SERVICE = new InjectionToken<QueryClientService>('QueryClientService');

/**
 * Injection token for the default QueryClient
 * Used to inject the default QueryClient into a component or service
 */
export const DEFAULT_QUERY_CLIENT = new InjectionToken<QueryClient>('DefaultQueryClient');

/**
 * Injection token for the Pokemon QueryClient
 * Used to inject the Pokemon QueryClient into a component or service
 */
export const POKEMON_QUERY_CLIENT = new InjectionToken<QueryClient>('PokemonQueryClient');

/**
 * Injection token for the Other QueryClient
 * Used to inject the Other QueryClient into a component or service
 */
export const OTHER_QUERY_CLIENT = new InjectionToken<QueryClient>('OtherQueryClient');