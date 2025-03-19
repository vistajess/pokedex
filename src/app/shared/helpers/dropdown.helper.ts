import { DropdownOption } from "../component/dropdown/dropdown.component";

/**
 * Converts any enum to dropdown options
 * @param enumObject The enum to convert to dropdown options
 * @returns Array of DropdownOption objects
 */
export const getEnumDropdownOptions = (enumObject: Record<string, string>): DropdownOption[] => {
  return Object.entries(enumObject).map(([key, value]) => ({
    value: value,
    label: formatTypeLabel(value)
  }));
}

/**
 * Formats the type string to be more readable
 * Capitalizes first letter and adds proper spacing
 */
const formatTypeLabel = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
