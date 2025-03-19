import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { map, Observable, Subject } from 'rxjs';
import { PokemonSelectors } from 'src/app/core/data/pokemon';
import { PokemonFilters } from 'src/app/core/data/pokemon/types/pokemon-filters';
import { Pokemon, PokemonTypeEnum } from 'src/app/core/types';
import { CheckboxOption } from 'src/app/shared/component/checkbox-group/checkbox-group.component';
import { DropdownOption } from 'src/app/shared/component/dropdown/dropdown.component';
import { DynamicFieldConfig } from 'src/app/shared/directives/dynamic-form-field/dynamic-form-field.directive';
import { ComponentType, DROPDOWN_COMPONENT } from 'src/app/shared/helpers/component.helper';
import { getEnumDropdownOptions } from 'src/app/shared/helpers/dropdown.helper';
import { DynamicFormFieldsModule } from 'src/app/shared/modules/dynamic-form-fields.module';
import { ComponentRegistryService } from 'src/app/shared/services/component-registry.service';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrls: ['./sidebar-filter.component.scss']
})
export class SidebarFilterComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({});

  pokemonTypeOptions: DropdownOption[] = [];

  pokemonList$: Observable<Pokemon[]>;

  pokemonFilters$: Observable<PokemonFilters>;

  heightOptions: CheckboxOption[] = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ];

  private _destroy$ = new Subject<void>();

  @Output() filtersChanged = new EventEmitter<PokemonFilters>();

  formFieldConfigs: DynamicFieldConfig[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private formFieldsModule: DynamicFormFieldsModule,
    private componentRegistry: ComponentRegistryService
  ) {

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

    // Define form field configurations (note: no direct component references)
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
        initialValue: 20
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

  buildForm(): void {
    const formGroupConfig: Record<string, any> = {};
    const statsGroupConfig: Record<string, any> = {};

    this.formFieldConfigs.forEach(fieldConfig => {
      if (fieldConfig.name.startsWith('stats.')) {
        const controlName = fieldConfig.name.split('.')[1];
        statsGroupConfig[controlName] = [fieldConfig.initialValue];
      } else {
        formGroupConfig[fieldConfig.name] = [fieldConfig.initialValue];
      }
    });

    formGroupConfig['stats'] = this.fb.group(statsGroupConfig);
    this.form = this.fb.group(formGroupConfig);
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
      console.log(this.form.value);
      this.filtersChanged.emit(this.form.value);
    }
  }

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
    console.log('Form:', this.form);
  }

  getPokemonTypeOptions = (): DropdownOption[] => {
    return getEnumDropdownOptions(PokemonTypeEnum);
  }

}
