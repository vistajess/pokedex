/**
 * Constants for the Pokemon API
 */
export const POKEMON_API = {
  /** Base URL for the Pokemon API */
  BASE_URL: 'https://pokeapi.co/api/v2',
  /** API endpoints */
  ENDPOINTS: {
    /** Pokemon endpoint for fetching pokemon data */
    POKEMON: '/pokemon',
    /** Pokemon species endpoint for fetching evolutionary data */
    POKEMON_SPECIES: '/pokemon-species',
    /** Types endpoint for fetching type data */
    TYPES: '/type',
    /** Abilities endpoint for fetching ability data */
    ABILITIES: '/ability'
    // Add other endpoints as needed
  }
}; 