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
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  pokemonHashMap: Map<string, Pokemon> = new Map<string, Pokemon>(); // Map to store Pokémon data

  pokemonDetails$!: Observable<{ [key: string]: PokemonDetail }>; // Observable for Pokémon details

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport; // Reference to the virtual scroll viewport

  pokemonList$: Observable<any[]>; // Observable for the list of Pokémon

  isLoading$: Observable<boolean>; // Observable to track loading state

  totalLoaded$: Observable<number>; // Observable for total loaded Pokémon count

  isMaxPokemonsLoaded$: Observable<boolean>; // Observable to track if max Pokémon are loaded

  isBatchLoading$: Observable<boolean>; // Observable to track if batch loading is in progress

  itemSize = 50; // Height of each item in pixels

  private destroy$ = new Subject<void>(); // Subject to manage unsubscription

  constructor(
    private store: Store,
    public pokemonHelperService: PokemonHelperService) {
    // Selectors to get data from the store
    this.pokemonList$ = this.store.select(PokemonSelectors.visiblePokemons).pipe(
      map(list => list || []) // Ensure list is an array
    );
    this.isLoading$ = this.store.select(PokemonSelectors.isLoading);
    this.totalLoaded$ = this.store.select(PokemonSelectors.totalLoaded)
      .pipe(map((totalLoaded) => ((totalLoaded ?? 0) / 1000) * 100)); // Calculate percentage of loaded Pokémon
    this.isMaxPokemonsLoaded$ = this.store.select(PokemonSelectors.isMaxPokemonsLoaded);
    this.isBatchLoading$ = this.store.select(PokemonSelectors.isBatchLoading);
  }

  ///
  /// life cycle
  ///

  ngOnInit(): void {
    // Load Pokémon data when component initializes
    this.store.dispatch(new LoadPokemons({ batchSize: 200 }));

    this.pokemonList$
      .pipe(takeUntil(this.destroy$)) // Unsubscribe when component is destroyed
      .subscribe(list => {
        this.pokemonHashMap.clear(); // Clear previous Pokémon data
        if (list.length > 0) {
          list.forEach(pokemon => {
            this.pokemonHashMap.set(pokemon.name, pokemon); // Store Pokémon in the hash map
          });
        }
      });
  }

  ngAfterViewInit() {
    // Wait for the viewport to be available before setting up scroll handler
    if (this.viewport) {
      this.setupScrollHandler(); // Initialize scroll handler
    } else {
      console.error('Virtual scroll viewport not initialized'); // Log error if viewport is not available
    }
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emit value to complete the observable
    this.destroy$.complete(); // Complete the subject
  }

  ///
  /// getter
  ///

  get pokemonHashMapToArray(): Pokemon[] {
    // Convert the hash map to an array of Pokémon
    return Array.from(this.pokemonHashMap.values());
  }

  ///
  /// methods
  ///

  /// This will be used to load more Pokémon when the user scrolls near the bottom
  // Basically when API is good for filtering, we can use this to load more Pokémon
  // API for now can't handle complex filtering
  setupScrollHandler() {
    // Set up a scroll handler for the virtual scroll viewport
    this.viewport.elementScrolled().pipe(
      takeUntil(this.destroy$), // Unsubscribe when component is destroyed
      throttleTime(200), // Limit scroll events to once per 200ms to improve performance
      map(() => this.viewport.measureScrollOffset('bottom')), // Get the distance from the bottom of the viewport
      pairwise(), // Compare current and previous bottom offset values
      filter(([y1, y2]) => y2 < 200 && y1 > y2) // Trigger when scrolling down and near the bottom (less than 200px from bottom)
    ).subscribe(() => {
      // Load more Pokémon when user scrolls near the bottom
      // ... existing code to load more Pokémon ...
    });
  }

  trackByIndex(index: number, item: any): number {
    // Track items by their index for better performance in ngFor
    return index;
  }

  onFiltersChanged(filters: PokemonFilters): void {
    // Dispatch action to set filters when filters change
    this.store.dispatch(new SetFilters(filters));
  }

  onSearchChanged(filters: PokemonFilters): void {
    // Dispatch action to set filters when search changes
    this.store.dispatch(new SetFilters(filters));
  }
}
