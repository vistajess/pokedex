import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, finalize, forkJoin, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { PokemonSelectors, PokemonService } from 'src/app/core/data/pokemon';
import { AbilityDetail, PokemonDetail, PokemonSpeciesDetail } from 'src/app/core/types';
import { EvolutionChain, EvolutionDetail } from 'src/app/core/types/evolution';

/**
 * DetailDrawerComponent handles the display of detailed Pokemon information in a side drawer.
 * Features:
 * - Displays Pokemon species info, evolution chain, and abilities
 * - Keyboard navigation (left/right arrows) between Pokemon
 * - Loading states and error handling
 * - Concurrent data fetching for abilities
 */
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

  /**
   * Keyboard event handler for navigating between Pokemon
   * - Left Arrow: Show previous Pokemon
   * - Right Arrow: Show next Pokemon
   * Only active when drawer is open
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.handlePreviousPokemon();
        break;
      case 'ArrowRight':
        
        this.handleNextPokemon();
        break;
    }
  }

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

  }

  /**
   * Handles navigation to the next Pokemon in the Pokedex
   * Retrieves the Pokemon with ID + 1 from the store
   */
  getNextPokemon(currentPokemon: PokemonDetail): PokemonDetail | null {
    return this.store.selectSnapshot(PokemonSelectors.pokemons)
      .find((p) => p.details?.id === currentPokemon?.id + 1)?.details || null;
  }

  /**
   * Handles navigation to the previous Pokemon in the Pokedex
   * Retrieves the Pokemon with ID - 1 from the store
   * Returns null if current Pokemon is #1
   */
  getPreviousPokemon(currentPokemon: PokemonDetail): PokemonDetail | null {
    if (currentPokemon?.id === 1) return null;

    return this.store.selectSnapshot(PokemonSelectors.pokemons)
      .find((p) => p.details?.id === currentPokemon?.id - 1)?.details || null;
  }

  /**
   * Maps evolution chain data to Pokemon details from the store
   * Combines evolution level requirements with Pokemon data
   * @returns Array of {details, minLevel} objects for the evolution chain
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
   * Extracts English ability description from effect entries
   * @returns English effect description string
   */
  getEnglishAffectEntries(ability: any): string {
    return ability.effect_entries.find((entry: any) => entry.language.name === 'en').effect;
  }

  /**
   * Extracts English flavor text from species details
   * @returns Pokemon description in English or placeholder
   */
  getEnglishSpeciesDetails(speciesDetails: any): string {
    return speciesDetails.flavor_text_entries.find((entry: any) => entry.language.name === 'en').flavor_text || 'This is placeholder for pokemon description';
  }

  /**
   * Extracts English genus (category) from species details
   * Example: "Seed Pokemon", "Flame Pokemon"
   */
  getGenera(speciesDetails: any): string {
    return speciesDetails.genera.find((genus: any) => genus.language.name === 'en').genus; 
  }

  /**
   * Converts Pokemon height from decimeters to meters
   * @returns Formatted height string with 'm' suffix
   */
  getHeight(height: number = 0): string {
    return (height / 10).toString() + 'm';
  }

  /**
   * Converts Pokemon weight from hectograms to kilograms
   * @returns Formatted weight string with 'kg' suffix
   */
  getWeight(weight: number = 0): string {
    return (weight / 10).toString() + 'kg';
  }

  /**
   * Recursively builds a flat array of Pokemon evolution stages
   * Each entry contains the Pokemon name and minimum level required to evolve
   * @returns Array of evolution chain entries in order of evolution
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

  /**
   * Navigates to the next Pokemon if available and drawer is open
   * Triggers a full data refresh for the new Pokemon
   */
  handleNextPokemon() {
    if (this.nextPokemon && this.isDrawerOpen) {
      this.details = this.nextPokemon;
      this.getPokemonDetails(this.details);
    }
  }

  /**
   * Navigates to the previous Pokemon if available and drawer is open
   * Triggers a full data refresh for the new Pokemon
   */
  handlePreviousPokemon() {
    if (this.previousPokemon && this.isDrawerOpen) {
      this.details = this.previousPokemon;
      this.getPokemonDetails(this.details);
    }
  }

  /**
   * Resets component state when drawer is closed
   * Clears current Pokemon details and navigation references
   * Emits drawerClosed event
   */
  handleDrawerClosed() {
    this.details = null;
    this.previousPokemon = null;
    this.nextPokemon = null;
    this.drawerClosed.emit();
  }

}
