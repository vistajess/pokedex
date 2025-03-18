import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, pairwise, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { PokemonHelperService } from 'src/app/core/data/pokemon/helpers/services/pokemon-helper.service';
import { PokemonSelectors } from 'src/app/core/data/pokemon/store';
import { FetchFilteredPokemon, LoadPokemons, SetFilters } from 'src/app/core/data/pokemon/store/pokemon-actions';
import { PokemonFilters } from 'src/app/core/data/pokemon/types/pokemon-filters';
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

  totalLoaded$: Observable<number>;

  itemSize = 50; // Height of each item in pixels

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    public pokemonHelperService: PokemonHelperService) {
    this.pokemonList$ = this.store.select(PokemonSelectors.visiblePokemons).pipe(
      map(list => list || [])
    );
    this.isLoading$ = this.store.select(PokemonSelectors.isLoading);
    this.totalLoaded$ = this.store.select(PokemonSelectors.totalLoaded)
      .pipe(map((totalLoaded) => ((totalLoaded ?? 0) / 1000) * 100));

  }

  ///
  /// life cycle
  ///

  ngOnInit(): void {
    // Load pokemons
    this.store.dispatch(new LoadPokemons({ batchSize: 200 }));

    this.pokemonList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.pokemonHashMap.clear();
        if (list.length > 0) {
          list.forEach(pokemon => {
            this.pokemonHashMap.set(pokemon.name, pokemon);
          });
        }
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

  isLoadingDetail(id: string): Observable<boolean> {
    return this.pokemonHelperService.isLoadingDetail(id);
  }

  getPokemonDetail(name: string): Observable<PokemonDetail | undefined> {
    return this.pokemonHelperService.getPokemonDetail(name);
  }

  getPokemonId(url: string): string {
    return this.pokemonHelperService.getPokemonId(url);
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

    });
  }

  loadPokemon(): void {
    // console.log('Attempting to load Pokemon');

    // const isLoading = this.store.selectSnapshot(PokemonSelectors.isLoading);
    // const hasMore = this.store.selectSnapshot(PokemonSelectors.hasMorePokemon);

    // if (!isLoading && hasMore) {
    //   const offset = this.store.selectSnapshot(PokemonSelectors.getOffset);
    //   const limit = this.store.selectSnapshot(PokemonSelectors.getLimit);

    //   this.store.dispatch(new FetchPokemonList({ offset, limit }));
    //   this.store.dispatch(new FetchFilteredPokemon({ limit, offset }));
    // }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  onFiltersChanged(filters: PokemonFilters): void {
    this.store.dispatch(new SetFilters(filters));
  }

  onSearchChanged(filters: PokemonFilters): void {
    this.store.dispatch(new SetFilters(filters));
  }
}
