import { Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/query-core';

@Injectable({
  providedIn: 'root'
})
export class QueryClientService {
  private _queryClient: QueryClient;

  constructor() {
    this._queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60 * 5
        }
      }
    });
  }

  get queryClient(): QueryClient {
    return this._queryClient;
  }
}