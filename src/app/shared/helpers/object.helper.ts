/**
 * Returns true if the given object has a value
 */
export const hasValue = <T = any,>(source: T): boolean => {
  return source !== undefined && source !== null && (<unknown>source as string) !== '';
}

/**
 * Returns given array or empty array. If non-array item is given it will be returned in an array.
 * @example
 * arrayOrEmpty([foo, bar]) => [foo, bar]
 * arrayOrEmpty('foo') => ['foo']
 * arrayOrEmpty(undefined) => []
 */
export const arrayOrEmpty = <T,>(source: T[] | T): T[] => {
  // we already have an array, retun as is
  if (Array.isArray(source)) return source;
  // we have a single item, return as array
  if (hasValue(source)) return [source];
  // we have no value, return empty array
  return [] as T[];
}