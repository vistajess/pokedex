import { InjectionToken } from '@angular/core';
import { QueryClient } from '@tanstack/query-core';

interface QueryClientService {
  queryClient: QueryClient;
}

export const QUERY_CLIENT_SERVICE = new InjectionToken<QueryClientService>('QueryClientService');
export const DEFAULT_QUERY_CLIENT = new InjectionToken<QueryClient>('DefaultQueryClient');
export const POKEMON_QUERY_CLIENT = new InjectionToken<QueryClient>('PokemonQueryClient');
export const OTHER_QUERY_CLIENT = new InjectionToken<QueryClient>('OtherQueryClient');