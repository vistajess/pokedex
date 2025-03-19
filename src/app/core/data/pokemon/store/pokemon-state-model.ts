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
  /** Currently selected Pokémon with detailed information */
  selectedPokemon: Pokemon | null;
  /** Flag indicating if a request is in progress */
  isLoading: boolean;
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
  selectedPokemon: null,
  isLoading: false,
  error: null,
  offset: 0,
  limit: 20,
  details: {},
  loadingDetails: [],
  detailsError: null,
  filters: {},
  filteredPokemons: []
}

