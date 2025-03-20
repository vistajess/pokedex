import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { OpenAISearchPokemon, SetFilters } from 'src/app/core/data/pokemon';
import { PokemonFilters } from 'src/app/core/data/pokemon/types/pokemon-filters';
import { FilterService } from 'src/app/core/services/filter.service';
import { OpenAIService } from 'src/app/core/services/openai.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  searchControl = new FormControl('');

  aiAssistControl = new FormControl(false);

  private _destroy$ = new Subject<void>();

  @Output() onSearchChanged = new EventEmitter<PokemonFilters>();

  constructor(
    private openaiService: OpenAIService,
    private filterService: FilterService,
    private store: Store
  ) { }

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  async interpretDescription() {
    if (this.aiAssistControl.value) {
      // OpenAI assist logic
      this.store.dispatch(new OpenAISearchPokemon({ search: this.searchControl.value }));
    } else {
      // Normal search logic
      this.store.dispatch(new SetFilters({
        type: null,
        heightCategory: null,
        search: [this.searchControl.value],
        stats: { hp: 0, attack: 0, defense: 0, speed: 0 }
      } ));
    }
  }
}
