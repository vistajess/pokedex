import { Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/query-core';
import { QUERY_CLIENT_DEFAULT_OPTIONS } from './query-client-default-options';

/**
 * Service that provides a centralized QueryClient instance for the application.
 * This service is provided at the root level and can be injected anywhere in the app.
 */
@Injectable({
  providedIn: 'root'
})
export class QueryClientService {
  // Private instance of QueryClient to prevent direct modification from outside
  private _queryClient: QueryClient;

  /**
   * Initializes a new QueryClient with the default options.
   * The QueryClient is responsible for managing query caching, refetching, and state.
   */
  constructor() {
    this._queryClient = new QueryClient(QUERY_CLIENT_DEFAULT_OPTIONS);
  }

  /**
   * Getter that provides read-only access to the QueryClient instance.
   * This allows components and services to use the QueryClient without modifying it.
   * 
   * @returns The configured QueryClient instance
   */
  get queryClient(): QueryClient {
    return this._queryClient;
  }
}