import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { map, Observable, Subject } from 'rxjs';
import { PokemonSelectors } from 'src/app/core/data/pokemon';
import { PokemonFilters } from 'src/app/core/data/pokemon/types/pokemon-filters';
import { Pokemon, PokemonTypeEnum } from 'src/app/core/types';
import { CheckboxOption } from 'src/app/shared/component/checkbox-group/checkbox-group.component';
import { DropdownOption } from 'src/app/shared/component/dropdown/dropdown.component';
import { DynamicFieldConfig } from 'src/app/shared/component/dynamic-form/dynamic-form-field/dynamic-form-field.directive';
import { ComponentType } from 'src/app/shared/helpers/component.helper';
import { getEnumDropdownOptions } from 'src/app/shared/helpers/dropdown.helper';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrls: ['./sidebar-filter.component.scss']
})
export class SidebarFilterComponent implements OnInit, OnDestroy {

  // Form group to handle all filter controls
  form: FormGroup = new FormGroup({});

  // Options for Pokemon type dropdown, populated from enum
  pokemonTypeOptions: DropdownOption[] = [];

  // Observable of filtered Pokemon list
  pokemonList$: Observable<Pokemon[]>;

  // Observable of current filter state
  pokemonFilters$: Observable<PokemonFilters>;

  // Predefined options for height filter
  heightOptions: CheckboxOption[] = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ];

  // Subject for cleanup on component destroy
  private _destroy$ = new Subject<void>();

  // Event emitter to notify parent of filter changes
  @Output() filtersChanged = new EventEmitter<PokemonFilters>();

  // Configuration for dynamic form fields
  formFieldConfigs: DynamicFieldConfig[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    // Initialize observables from store
    this.pokemonList$ = this.store.select(PokemonSelectors.visiblePokemons).pipe(
      map(list => list || [])
    );

    this.pokemonFilters$ = this.store.select(PokemonSelectors.filters);
  }

  ///
  /// life cycle
  ngOnInit(): void {

    // Get dropdown options from enum
    this.pokemonTypeOptions = this.getPokemonTypeOptions();

    // Define form field configurations
    this.formFieldConfigs = [
      {
        name: 'type',
        type: ComponentType.DROPDOWN,
        label: 'Type',
        initialValue: '',
        options: this.getPokemonTypeOptions()
      },
      {
        name: 'heightCategory',
        type: ComponentType.CHECKBOX,
        label: 'Height',
        initialValue: '',
        options: this.heightOptions
      },
      {
        name: 'stats.hp',
        type: ComponentType.SLIDER,
        label: 'HP',
        initialValue: 0
      },
      {
        name: 'stats.attack',
        type: ComponentType.SLIDER,
        label: 'Attack',
        initialValue: 0
      },
      {
        name: 'stats.defense',
        type: ComponentType.SLIDER,
        label: 'Defense',
        initialValue: 0
      },
      {
        name: 'stats.speed',
        type: ComponentType.SLIDER,
        label: 'Speed',
        initialValue: 0
      },
    ];

    // Build the form using FormBuilder
    this.buildForm();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ///
  /// methods
  ///

  buildForm(): void {
    // Separate configs for main form and nested stats group
    const formGroupConfig: Record<string, any> = {};
    const statsGroupConfig: Record<string, any> = {};

    // Sort fields into main form or stats subgroup
    this.formFieldConfigs.forEach(fieldConfig => {
      if (fieldConfig.name.startsWith('stats.')) {
        const controlName = fieldConfig.name.split('.')[1];
        statsGroupConfig[controlName] = [fieldConfig.initialValue];
      } else {
        formGroupConfig[fieldConfig.name] = [fieldConfig.initialValue];
      }
    });

    // Create nested form structure
    formGroupConfig['stats'] = this.fb.group(statsGroupConfig);
    this.form = this.fb.group(formGroupConfig);
  }

  // Emit filter values when form is valid
  filterPokemon() {
    if (this.form.valid) {
      this.filtersChanged.emit(this.form.value);
    }
  }

  // Reset all filters to initial state
  clearFilters() {
    this.form.reset();
    this.form.patchValue({
      stats: {
        hp: 0,
        attack: 0,
        defense: 0,
        speed: 0
      }
    });
    this.filtersChanged.emit(this.form.value);
  }

  // Helper to convert enum to dropdown options
  getPokemonTypeOptions = (): DropdownOption[] => {
    return getEnumDropdownOptions(PokemonTypeEnum);
  }

}
