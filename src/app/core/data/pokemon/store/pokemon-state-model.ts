import { Pokemon, PokemonDetail } from 'src/app/core/types';
import { PokemonListResponse } from '../types';
import { PokemonFilters } from '../types/pokemon-filters';

/**
 * Interface representing the Pokemon state in the store
 * Contains information about pokemon list, selected pokemon details, loading state and errors
 */
export interface PokemonStateModel {
  pokemons: Pokemon[];
  totalLoaded: number;
  /** Currently selected pokemon with detailed information */
  selectedPokemon: Pokemon | null;
  /** Flag indicating if a request is in progress */
  isLoading: boolean;
  /** Error message if any request fails */
  error: string | null;
  offset: number;
  limit: number;
  details: { [key: string]: PokemonDetail }; // Map pokemon name to its details
  loadingDetails: string[]; // IDs of Pokemon currently being loaded
  detailsError: any;

  filters: PokemonFilters;
  filteredPokemons: Pokemon[];
}

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
