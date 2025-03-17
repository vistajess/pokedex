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

  pokemonDetails$!: Observable<{ [key: string]: PokemonDetail }>;

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
    this.pokemonDetails$ = this.store.select(PokemonSelectors.getPokemonDetails) as Observable<{ [key: string]: PokemonDetail }>;
  }

  ///
  /// life cycle
  ///

  ngOnInit(): void {
    // Initial load
    this.loadPokemon();

    this.pokemonList$.subscribe(list => {
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

  ///
  /// getter
  ///

  get pokemonHashMapToArray(): Pokemon[] {
    return Array.from(this.pokemonHashMap.values());
  }

  ///
  /// methods
  ///

  setupScrollHandler() {
    // ... existing code ...
    this.viewport.elementScrolled().pipe(
      // Unsubscribe when component is destroyed
      takeUntil(this.destroy$),
      // Limit scroll events to once per 200ms to improve performance
      throttleTime(200),
      // Get the distance from the bottom of the viewport
      map(() => this.viewport.measureScrollOffset('bottom')),
      // Compare current and previous bottom offset values
      pairwise(),
      // Only trigger when scrolling down and near the bottom (less than 200px from bottom)
      filter(([y1, y2]) => y2 < 200 && y1 > y2)
    ).subscribe(() => {
      // Load more Pokemon when user scrolls near the bottom
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

  // Check if a Pokemon detail is currently loading
  isLoadingDetail(id: string): Observable<boolean> {
    return this.store.select(PokemonSelectors.isLoadingDetail).pipe(
      map(selectorFn => selectorFn(id))
    );
  }
}
