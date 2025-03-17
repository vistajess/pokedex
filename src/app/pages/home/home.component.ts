import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, pairwise, takeUntil, throttleTime } from 'rxjs/operators';
import { PokemonSelectors } from 'src/app/core/data/pokemon/store';
import { FetchPokemonDetail, FetchPokemonList } from 'src/app/core/data/pokemon/store/pokemon-actions';
import { Pokemon, PokemonDetail } from 'src/app/core/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './components/virtualized-viewport/virtualized-viewport.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  pokemonHashMap: Map<string, Pokemon> = new Map<string, Pokemon>();
  pokemonDetails$!: Observable<{[key: string]: PokemonDetail}>;

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  
  pokemonList$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  hasMorePokemon$: Observable<boolean>;
  
  itemSize = 50; // Height of each item in pixels
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.pokemonList$ = this.store.select(PokemonSelectors.getPokemonList).pipe(
      map(list => list || [])
    );
    this.isLoading$ = this.store.select(PokemonSelectors.isLoading);
    this.hasMorePokemon$ = this.store.select(PokemonSelectors.hasMorePokemon);

    this.pokemonDetails$ = this.store.select(PokemonSelectors.getPokemonDetails) as Observable<{[key: string]: PokemonDetail}>;
  }

  ngOnInit(): void {
    // Initial load
    this.loadPokemon();
    
    // Log state for debugging
    this.pokemonList$.subscribe(list => {
      // console.log('Pokemon list updated:', list);
      list.forEach(pokemon => {
        this.pokemonHashMap.set(pokemon.name, pokemon);
        // Fetch details for each Pokemon
        this.fetchPokemonDetail(pokemon);
      });
    });
  }

  ngAfterViewInit() {
    // Wait for viewport to be available
    if (this.viewport) {
      this.setupScrollHandler();
    } else {
      console.error('Virtual scroll viewport not initialized');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupScrollHandler() {
    this.viewport.elementScrolled().pipe(
      takeUntil(this.destroy$),
      throttleTime(200),
      map(() => this.viewport.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => {
        console.log(`Scroll position: ${y2}px from bottom`);
        return y2 < 200 && y1 > y2;
      })
    ).subscribe(() => {
      console.log('Loading more Pokemon...');
      this.loadMorePokemon();
    });
  }

  loadPokemon(): void {
    console.log('Attempting to load Pokemon');
    
    const isLoading = this.store.selectSnapshot(PokemonSelectors.isLoading);
    const hasMore = this.store.selectSnapshot(PokemonSelectors.hasMorePokemon);
    
    if (!isLoading && hasMore) {
      const offset = this.store.selectSnapshot(PokemonSelectors.getOffset);
      const limit = this.store.selectSnapshot(PokemonSelectors.getLimit);
      
      console.log(`Dispatching FetchPokemonList with offset: ${offset}, limit: ${limit}`);
      this.store.dispatch(new FetchPokemonList({ offset, limit }));
    }
  }

  loadMorePokemon(): void {
    const isLoading = this.store.selectSnapshot(PokemonSelectors.isLoading);
    const hasMore = this.store.selectSnapshot(PokemonSelectors.hasMorePokemon);
    console.log('isLoading', isLoading);
    console.log('hasMore', hasMore);
    if (!isLoading && hasMore) {
      const offset = this.store.selectSnapshot(PokemonSelectors.getOffset);
      const limit = this.store.selectSnapshot(PokemonSelectors.getLimit);
      
      console.log(`Loading more Pokemon with offset: ${offset}, limit: ${limit}`);
      this.store.dispatch(new FetchPokemonList({ offset, limit }));
    }
  }

  getPokemonId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
  
  get pokemonHashMapToArray(): Pokemon[] {
    return Array.from(this.pokemonHashMap.values());
  }

  fetchPokemonDetail(pokemon: Pokemon): void {
    const pokemonId = this.getPokemonId(pokemon.url);
    
    // Check if we already have the details in the state
    const hasDetail = this.store.selectSnapshot(PokemonSelectors.getPokemonDetailByName)(pokemon.name);
    if (!hasDetail) {
      // Dispatch action to fetch details
      this.store.dispatch(new FetchPokemonDetail({ id: pokemonId }));
    }
  }

  // Helper method to get Pokemon detail from state
  getPokemonDetail(name: string): Observable<PokemonDetail | undefined> {
    return this.store.select(PokemonSelectors.getPokemonDetailByName).pipe(
      map(selectorFn => selectorFn(name) as PokemonDetail | undefined)
    );
  }
  
  // // Check if a Pokemon detail is currently loading
  isLoadingDetail(id: string): Observable<boolean> {
    return this.store.select(PokemonSelectors.isLoadingDetail).pipe(
      map(selectorFn => selectorFn(id))
    );
  }
}
