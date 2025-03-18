/**
 * Height category type definition
 */
export type HeightCategory = 'small' | 'medium' | 'large';

/**
* Categorizes a Pokemon's height into small, medium, or large
* @param height - The height value in decimeters
* @returns A string representing the size category
*/
export const categorizeHeight = (height: number): HeightCategory => {
  // Height is in decimeters (1 decimeter = 0.1 meters)
  if (height < 8) {
    return 'small';    // Less than 0.8 meters
  } else if (height < 15) {
    return 'medium';   // Between 0.8 and 1.5 meters
  } else {
    return 'large';    // 1.5 meters or taller
  }
}