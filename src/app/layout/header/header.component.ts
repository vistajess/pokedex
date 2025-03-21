import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { OpenAISearchPokemon, SetFilters } from 'src/app/core/data/pokemon';
import { PokemonFilters } from 'src/app/core/data/pokemon/types/pokemon-filters';
import { FilterService } from 'src/app/core/services/filter.service';
import { OpenAIService } from 'src/app/core/services/openai.service';

/**
 * Header component responsible for search functionality and filter management.
 * Provides both regular text search and AI-assisted search capabilities.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Form control for the search input field
  searchControl = new FormControl('');

  // Toggle for AI-assisted search functionality
  aiAssistControl = new FormControl(false);

  // Subject for handling component cleanup
  private _destroy$ = new Subject<void>();

  // Event emitter to notify parent component of search filter changes
  @Output() onSearchChanged = new EventEmitter<PokemonFilters>();

  constructor(
    private filterService: FilterService,
    private store: Store          
  ) { }

  /**
   * Initialize component and subscribe to filter clear events
   */
  ngOnInit(): void {
    // Reset search input and filters when clear filter event is triggered
    this.filterService.onClearFiltersClicked
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.searchControl.setValue('');
        this.store.dispatch(new SetFilters({ 
          type: null, 
          heightCategory: null, 
          search: undefined,
          stats: { hp: 0, attack: 0, defense: 0, speed: 0 } 
        }));
      });
  }

  /**
   * Cleanup subscriptions on component destruction
   */
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * Handles search interpretation based on AI assist toggle
   * If AI assist is enabled, uses OpenAI for natural language processing
   * Otherwise performs standard text search
   */
  async interpretDescription() {
    if (this.aiAssistControl.value) {
      // Dispatch OpenAI-assisted search action
      this.store.dispatch(new OpenAISearchPokemon({ search: this.searchControl.value }));
    } else {
      // Dispatch regular search with basic filters
      this.store.dispatch(new SetFilters({
        type: null,
        heightCategory: null,
        search: [this.searchControl.value],
        stats: { hp: 0, attack: 0, defense: 0, speed: 0 }
      } ));
    }
  }
}
