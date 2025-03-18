import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { map, Observable, of, Subject } from 'rxjs';
import { PokemonSelectors } from 'src/app/core/data/pokemon';
import { PokemonFilters } from 'src/app/core/data/pokemon/types/pokemon-filters';
import { Pokemon, PokemonTypeEnum } from 'src/app/core/types';
import { PokemonRarityEnum } from 'src/app/core/types/rarity';
import { CheckboxOption } from 'src/app/shared/component/checkbox-group/checkbox-group.component';
import { DropdownOption } from 'src/app/shared/component/dropdown/dropdown.component';
import { getEnumDropdownOptions } from 'src/app/shared/helpers/dropdown';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({});

  pokemonTypeOptions: DropdownOption[] = [];

  pokemonRarityOptions: DropdownOption[] = [];

  pokemonList$: Observable<Pokemon[]>;

  pokemonFilters$: Observable<PokemonFilters>;

  heightOptions: CheckboxOption[] = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ];

  private _destroy$ = new Subject<void>();

  @Output() filtersChanged = new EventEmitter<PokemonFilters>();

  constructor(
    private fb: FormBuilder,
    private store: Store) {

    this.pokemonList$ = this.store.select(PokemonSelectors.visiblePokemons).pipe(
      map(list => list || [])
    );

    this.pokemonFilters$ = this.store.select(PokemonSelectors.filters);
  }

  ///
  /// life cycle
  ngOnInit(): void {

    // Initialize the form
    this.form = this.fb.group({
      type: [''],
      rarity: [''],
      heightCategory: [''],
      hpStat: [0],
      attackStat: [0],
      defenseStat: [0],
      speedStat: [0]
    });

    // Get dropdown options from enum
    this.pokemonTypeOptions = this.getPokemonTypeOptions();
    this.pokemonRarityOptions = this.getPokemonRarityOptions();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ///
  /// methods
  ///

  filterPokemon() {
    if (this.form.valid) {
      this.filtersChanged.emit(this.form.value);
    }
  }

  clearFilters() {
    this.form.reset();
    this.filtersChanged.emit(this.form.value);
  }

  getPokemonTypeOptions = (): DropdownOption[] => {
    return getEnumDropdownOptions(PokemonTypeEnum);
  }

  getPokemonRarityOptions = (): DropdownOption[] => {
    return getEnumDropdownOptions(PokemonRarityEnum);
  }

}
