import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, finalize, forkJoin, map, take, Observable, Subject, switchMap, takeUntil, firstValueFrom, tap } from 'rxjs';
import { PokemonSelectors, PokemonService } from 'src/app/core/data/pokemon';
import { AbilityDetail, Pokemon, PokemonAbility, PokemonDetail, PokemonSpeciesDetail } from 'src/app/core/types';
import { EvolutionChain, EvolutionDetail } from 'src/app/core/types/evolution';
@Component({
  selector: 'pokemon-detail-drawer',
  templateUrl: './detail-drawer.component.html',
  styleUrls: ['./detail-drawer.component.scss']
})
export class DetailDrawerComponent implements OnInit, OnDestroy {

  speciesEvolutionDetails$!: Observable<{ species: PokemonSpeciesDetail, evolutionChain: EvolutionChain }>; // Observable for Pokémon species and evolution chain details.

  isLoading$ = new BehaviorSubject<boolean>(false); // Tracks loading state for data fetching.

  abilities: AbilityDetail[] = []; // Array to store the Pokémon's abilities.

  evolutionChain: string[] = []; // Array of Pokémon names in the evolution chain.

  evolutionChainDetails: { details: PokemonDetail, minLevel: number }[] = []; // Detailed evolution chain information with Pokémon details and levels.

  selectedAbility!: AbilityDetail; // Currently selected ability of the Pokémon.

  nextPokemon!: PokemonDetail | null;

  previousPokemon!: PokemonDetail | null;

  @Input() isDrawerOpen = false; // Controls the visibility of the detail drawer.

  @Output() drawerClosed = new EventEmitter<void>(); // Emits an event when the drawer is closed.

  private _destroy$ = new Subject<void>(); // Manages the lifecycle of subscriptions to prevent memory leaks.

  @Input()
  get details() { return this._details; } // Input property for Pokémon details that triggers data fetching.
  set details(value: PokemonDetail | null) {
    if (value) {
      this._details = value;
      this.getPokemonDetails(value); // Fetch details on input change
    }
  }
  private _details: PokemonDetail | null = null; // Holds the Pokémon detail object.

  constructor(
    private pokemonService: PokemonService, 
    private store: Store
  ) {}

  ///
  /// life cycle hooks
  ///
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ///
  /// methods
  ///

  /**
   * Fetches the details of the Pokémon, including its species and evolution chain.
   * Sets loading state while fetching data and updates abilities.
   * @param value - The Pokémon detail object containing the Pokémon's information.
   */
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

    // Fetch abilities concurrently
    const fetchAbility1$ = this.pokemonService.getPokemonAbilityByUrl(value?.abilities[0].ability.url);
    const fetchAbility2$ = this.pokemonService.getPokemonAbilityByUrl(value?.abilities[1].ability.url);
    forkJoin([
      fetchAbility1$, 
      fetchAbility2$
    ]).pipe(
      takeUntil(this._destroy$)
    ).subscribe(([ability1, ability2]) => {
      this.abilities = [ability1, ability2]; 
      this.selectedAbility = this.abilities[0];
    });

    this.nextPokemon = this.getNextPokemon(value);
    this.previousPokemon = this.getPreviousPokemon(value);

    console.log(this.nextPokemon, this.previousPokemon);
  }

  getNextPokemon(currentPokemon: PokemonDetail): PokemonDetail | null {
    return this.store.selectSnapshot(PokemonSelectors.pokemons)
      .find((p) => p.details?.id === currentPokemon?.id + 1)?.details || null;
  }

  getPreviousPokemon(currentPokemon: PokemonDetail): PokemonDetail | null {
    if (currentPokemon?.id === 1) return null;

    return this.store.selectSnapshot(PokemonSelectors.pokemons)
      .find((p) => p.details?.id === currentPokemon?.id - 1)?.details || null;
  }

  /**
   * Constructs the evolution chain details from the provided evolution chain.
   * Maps Pokémon names to their details and minimum evolution levels.
   * @param evolutionChain - An array of Pokémon evolution details.
   * @returns An array of objects containing Pokémon details and their minimum evolution levels.
   */
  buildEvolutionChain(evolutionChain: { name: string, minLevel: number }[]): any[] {
    const findPokemon = this.store.selectSnapshot(PokemonSelectors.pokemons);
    
    return evolutionChain.map((pokemonChain) => {
      return {
        details: findPokemon.find((p) => p.name === pokemonChain.name)?.details, // Find Pokémon details by name.
        minLevel: pokemonChain.minLevel // Get the minimum level for evolution.
      }
    });
  }

  /**
   * Retrieves the effect of an ability in English from its effect entries.
   * @param ability - The ability object containing effect entries.
   * @returns The effect description in English.
   */
  getEnglishAffectEntries(ability: any): string {
    return ability.effect_entries.find((entry: any) => entry.language.name === 'en').effect;
  }

  /**
   * Retrieves the flavor text of a Pokémon species in English from its flavor text entries.
   * If no English flavor text is found, returns a placeholder description.
   * @param speciesDetails - The species details object containing flavor text entries.
   * @returns The flavor text description in English or a placeholder if not found.
   */
  getEnglishSpeciesDetails(speciesDetails: any): string {
    return speciesDetails.flavor_text_entries.find((entry: any) => entry.language.name === 'en').flavor_text || 'This is placeholder for pokemon description';
  }

  /**
   * Retrieves the genus of a Pokémon species in English from its genera entries.
   * @param speciesDetails - The species details object containing genera entries.
   * @returns The genus description in English.
   */
  getGenera(speciesDetails: any): string {
    return speciesDetails.genera.find((genus: any) => genus.language.name === 'en').genus; 
  }

  /**
   * Converts height from decimeters to meters and returns it as a string.
   * @param height - The height in decimeters (default is 0).
   * @returns The height in meters as a string.
   */
  getHeight(height: number = 0): string {
    return (height / 10).toString() + 'm';
  }

  /**
   * Converts weight from hectograms to kilograms and returns it as a string.
   * @param weight - The weight in hectograms (default is 0).
   * @returns The weight in kilograms as a string.
   */
  getWeight(weight: number = 0): string {
    return (weight / 10).toString() + 'kg';
  }

  /**
   * Extracts the evolution chain details from the provided evolution chain object.
   * Recursively traverses the chain to build an array of Pokémon names and their minimum levels.
   * @param evolutionChain - The evolution chain object to traverse.
   * @returns An array of objects containing Pokémon names and their minimum evolution levels.
   */
  getEvolutionChain(evolutionChain: EvolutionChain): { name: string, minLevel: number }[] {
    const evolutionChainDetailsArr: { name: string, minLevel: number }[] = []; // Array to hold evolution chain details.

    const traverseChain = (chain: EvolutionDetail) => {
      evolutionChainDetailsArr.push({ 
        name: chain.species.name, // Add the Pokémon name to the array.
        minLevel: chain.evolution_details.length > 0 ? chain.evolution_details[0].min_level || 0 : 0 // Get the minimum level for evolution.
      });
      chain.evolves_to.forEach(traverseChain); // Recursively traverse the next Pokémon in the chain.
    }

    traverseChain(evolutionChain.chain); // Start traversing the evolution chain.

    return evolutionChainDetailsArr; // Return the completed evolution chain details array.
  }

}
