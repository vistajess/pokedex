import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PokemonSelectors } from 'src/app/core/data/pokemon/store';
import { PokemonDetail } from 'src/app/core/types';

@Injectable({
  providedIn: 'root'
})
export class PokemonHelperService {
  
  constructor(private store: Store) {}
  
  // Helper method to get Pokemon detail from state
  getPokemonDetail(name: string): Observable<PokemonDetail | undefined> {
    return this.store.select(PokemonSelectors.getPokemonDetailByName).pipe(
      map(selectorFn => selectorFn(name) as PokemonDetail | undefined)
    );
  }

  // Check if a Pokemon detail is currently loading
  isLoadingDetail(id: string): Observable<boolean> {
    return this.store.select(PokemonSelectors.isLoadingDetail).pipe(
      map(selectorFn => selectorFn(id))
    );
  }
  
  // Helper to extract Pokemon ID from URL
  getPokemonId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}