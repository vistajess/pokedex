import { Pokemon, PokemonDetail } from 'src/app/core/types';
import { PokemonFilters } from '../types/pokemon-filters';

/**
 * Interface representing the Pokemon state in the store
 * Contains information about pokemon list, selected pokemon details, loading state and errors
 */
export interface PokemonStateModel {
  /** List of loaded Pokémon */
  pokemons: Pokemon[];
  /** Total number of Pokémon loaded */
  totalLoaded: number;
  /** Maximum number of Pokémon to load */
  isMaxPokemonsLoaded: boolean;
  /** Currently selected Pokémon with detailed information */
  selectedPokemon: Pokemon | null;
  /** Flag indicating if a request is in progress */
  isLoading: boolean;
  /** Flag indicating if a batch request is in progress */
  isBatchLoading: boolean;
  /** Flag indicating if any request fails */
  hasError: boolean;
  /** Error message if any request fails */
  error: string | null;
  /** Current offset for paginated loading */
  offset: number;
  /** Number of Pokémon to load per request */
  limit: number;
  /** Map of Pokémon names to their details */
  details: { [key: string]: PokemonDetail };
  /** List of Pokémon IDs currently being fetched */
  loadingDetails: string[];
  /** Error object for details loading failures */
  detailsError: any;
  /** Filters applied to Pokémon list */
  filters: PokemonFilters;
  /** Pokémon filtered based on applied filters */
  filteredPokemons: Pokemon[];
}

/** Default initial state for the Pokémon store */
export const defaultPokemonState: PokemonStateModel = {
  pokemons: [],
  totalLoaded: 0,
  isMaxPokemonsLoaded: false,
  selectedPokemon: null,
  isLoading: false,
  isBatchLoading: false,
  hasError: false,
  error: null,
  offset: 0,
  limit: 20,
  details: {},
  loadingDetails: [],
  detailsError: null,
  filters: {},
  filteredPokemons: []
}

