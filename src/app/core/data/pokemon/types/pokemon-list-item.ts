/**
 * Interface representing a Pokemon item in a list view
 * Contains essential information for displaying Pokemon in lists or cards
 */
export interface PokemonListItem {
  /** The name of the Pokemon */
  name: string;
  
  /** The Pokedex number of the Pokemon */
  number: number;
  
  /** URL or path to the Pokemon's image */
  image: string;
  
  /** Array of Pokemon types (e.g., "Fire", "Water", etc.) */
  types: string[];
}

