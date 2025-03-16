import { QueryClient } from '@tanstack/query-core';

/**
 * Creates a QueryClient with default configuration.
 * 
 * This factory function provides a basic configuration suitable for general use cases.
 * 
 * @returns A new QueryClient instance with default configuration
 */
export function createDefaultQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevents automatic refetching when browser window regains focus
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Creates a QueryClient optimized for Pokemon data.
 * 
 * This configuration is tailored for Pokemon-related queries with longer
 * cache and stale times, as Pokemon data doesn't change frequently.
 * 
 * @returns A new QueryClient instance configured for Pokemon data
 */
export function createPokemonQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Prevents automatic refetching when browser window regains focus
        refetchOnWindowFocus: false,
        
        // Data remains fresh for 5 minutes before being marked as stale
        staleTime: 5 * 60 * 1000, // 5 minutes
        
        // Cached data is kept for 30 minutes before being garbage collected
        cacheTime: 30 * 60 * 1000, // 30 minutes
      },
    },
  });
}

/**
 * Creates a QueryClient with more aggressive refetching behavior.
 * 
 * This configuration is suitable for data that changes frequently or
 * requires higher reliability through automatic retries.
 * 
 * @returns A new QueryClient instance with aggressive refetching configuration
 */
export function createOtherQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Enables automatic refetching when browser window regains focus
        // Useful for frequently updated data
        refetchOnWindowFocus: true,
        
        // Automatically retry failed queries up to 3 times
        retry: 3,
        
        // Wait 1 second between retry attempts
        retryDelay: 1000,
      },
    },
  });
}