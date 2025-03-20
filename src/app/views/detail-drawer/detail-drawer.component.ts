import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, finalize, forkJoin, map, take, Observable, Subject, switchMap, takeUntil, firstValueFrom, tap } from 'rxjs';
import { PokemonSelectors, PokemonService } from 'src/app/core/data/pokemon';
import { Pokemon, PokemonDetail, PokemonSpeciesDetail } from 'src/app/core/types';
import { EvolutionChain, EvolutionDetail } from 'src/app/core/types/evolution';
@Component({
  selector: 'pokemon-detail-drawer',
  templateUrl: './detail-drawer.component.html',
  styleUrls: ['./detail-drawer.component.scss']
})
export class DetailDrawerComponent implements OnInit, OnDestroy {

  speciesEvolutionDetails$!: Observable<{ species: PokemonSpeciesDetail, evolutionChain: EvolutionChain }>;

  isLoading$ = new BehaviorSubject<boolean>(false);

  abilities$!: Observable<any>;

  abilities: any[] = [];

  evolutionChain$!: Observable<any>;

  evolutionChain: string[] = [];

  evolutionChainDetails: { details: PokemonDetail, minLevel: number }[] = [];

  selectedAbility: any;

  @Input() isDrawerOpen = false;

  @Output() drawerClosed = new EventEmitter<void>();

  private _destroy$ = new Subject<void>();

  @Input()
  get details() { return this._details; }
  set details(value: PokemonDetail | null) {
    if (value) {
      this._details = value

      this.getPokemonDetails(value);
    }
  }
  private _details: PokemonDetail | null = null;

  constructor(private pokemonService: PokemonService, private store: Store) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getPokemonDetails(value: PokemonDetail) {
    this.isLoading$.next(true);
    this.speciesEvolutionDetails$ = this.pokemonService.getPokemonSpecies(value.name)
      .pipe(
        switchMap((species: any) => {
          return this.pokemonService.getEvolutionChain(species.evolution_chain.url)
            .pipe(
              map(evolutionChain => ({
                species,
                evolutionChain
              })),
              tap((speciesEvolutionDetails) => {
                const evolutionChain = this.getEvolutionChain(speciesEvolutionDetails.evolutionChain);
                this.evolutionChainDetails = this.buildEvolutionChain(evolutionChain);
              })
            );
        }),
        finalize(() => this.isLoading$.next(false))
      );

    // get abilities
    const ability1 = this.pokemonService.getPokemonAbilityByUrl(value?.abilities[0].ability.url);
    const ability2 = this.pokemonService.getPokemonAbilityByUrl(value?.abilities[1].ability.url);
    forkJoin([ability1, ability2]).subscribe(([ability1, ability2]) => {
      this.abilities = [ability1, ability2];
      this.selectedAbility = this.abilities[0];
    });
  }

  buildEvolutionChain(evolutionChain: { name: string, minLevel: number }[]): any[] {
    const findPokemon = this.store.selectSnapshot(PokemonSelectors.pokemons);
    
    return evolutionChain.map((pokemonChain) => {
      return {
        details:findPokemon.find((p) => p.name === pokemonChain.name)?.details,
        minLevel: pokemonChain.minLevel
      }
    })
  }

  getEnglishAffectEntries(ability: any): string {
    return ability.effect_entries.find((entry: any) => entry.language.name === 'en').effect;
  }

  getEnglishSpeciesDetails(speciesDetails: any): string {
    return speciesDetails.flavor_text_entries.find((entry: any) => entry.language.name === 'en').flavor_text || 'This is placeholder for pokemon description';
  }

  getGenera(speciesDetails: any): string {
    return speciesDetails.genera.find((genus: any) => genus.language.name === 'en').genus;
  }

  getHeight(height: number = 0): string {
    return (height / 10).toString() + 'm';
  }

  getWeight(weight: number = 0): string {
    return (weight / 10).toString() + 'kg';
  }

  getEvolutionChain(evolutionChain: EvolutionChain): { name: string, minLevel: number }[] {
    const evolutionChainDetailsArr: { name: string, minLevel: number }[] = [];

    const traverseChain = (chain: EvolutionDetail) => {
      evolutionChainDetailsArr.push({ 
        name: chain.species.name, 
        minLevel: chain.evolution_details.length > 0 ? chain.evolution_details[0].min_level || 0 : 0
      });
      chain.evolves_to.forEach(traverseChain);
    }

    traverseChain(evolutionChain.chain);

    return evolutionChainDetailsArr;
  }

}
