import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Store } from '@ngxs/store';
import { filter, map, pairwise, throttleTime, takeUntil } from 'rxjs/operators';
import { FetchPokemonList } from 'src/app/core/data/pokemon/store/pokemon-actions';
import { PokemonState } from 'src/app/core/data/pokemon/store/pokemon-state';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './components/virtualized-viewport/virtualized-viewport.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  
  pokemonList$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  hasMorePokemon$: Observable<boolean>;
  
  itemSize = 50; // Height of each item in pixels
  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.pokemonList$ = this.store.select(PokemonState.getPokemonList).pipe(
      map(list => list || [])
    );
    this.isLoading$ = this.store.select(PokemonState.isLoading);
    this.hasMorePokemon$ = this.store.select(PokemonState.hasMorePokemon);
  }

  ngOnInit(): void {
    // Initial load
    this.loadPokemon();
    
    // Log state for debugging
    this.pokemonList$.subscribe(list => {
      console.log('Pokemon list updated:', list);
    });
  }

  ngAfterViewInit() {
    // Wait for viewport to be available
    setTimeout(() => {
      if (this.viewport) {
        this.setupScrollHandler();
      } else {
        console.error('Virtual scroll viewport not initialized');
      }
    }, 0);
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
    
    const isLoading = this.store.selectSnapshot(PokemonState.isLoading);
    const hasMore = this.store.selectSnapshot(PokemonState.hasMorePokemon);
    
    if (!isLoading && hasMore) {
      const offset = this.store.selectSnapshot(PokemonState.getOffset);
      const limit = this.store.selectSnapshot(PokemonState.getLimit);
      
      console.log(`Dispatching FetchPokemonList with offset: ${offset}, limit: ${limit}`);
      this.store.dispatch(new FetchPokemonList({ offset, limit }));
    }
  }

  loadMorePokemon(): void {
    const isLoading = this.store.selectSnapshot(PokemonState.isLoading);
    const hasMore = this.store.selectSnapshot(PokemonState.hasMorePokemon);
    
    if (!isLoading && hasMore) {
      const offset = this.store.selectSnapshot(PokemonState.getOffset);
      const limit = this.store.selectSnapshot(PokemonState.getLimit);
      
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
}
