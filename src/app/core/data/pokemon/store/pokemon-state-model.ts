import { Pokemon, PokemonDetail } from 'src/app/core/types';
import { PokemonListResponse } from '../types';

/**
 * Interface representing the Pokemon state in the store
 * Contains information about pokemon list, selected pokemon details, loading state and errors
 */
export interface PokemonStateModel {
  /** The list of pokemon with pagination information */
  pokemonResponseList: PokemonListResponse | null;
  /** Currently selected pokemon with detailed information */
  selectedPokemon: Pokemon | null;
  /** Flag indicating if a request is in progress */
  isLoading: boolean;
  /** Error message if any request fails */
  error: string | null;
  offset: number;
  limit: number;
  hasMorePokemon: boolean;
  details: { [key: string]: PokemonDetail }; // Map pokemon name to its details
  loadingDetails: string[]; // IDs of Pokemon currently being loaded
  detailsError: any;
}


export const defaultPokemonState: PokemonStateModel = {
  pokemonResponseList: null,
  selectedPokemon: null,
  isLoading: false,
  error: null,
  offset: 0,
  limit: 20,
  hasMorePokemon: true,
  details: {},
  loadingDetails: [],
  detailsError: null
}; 