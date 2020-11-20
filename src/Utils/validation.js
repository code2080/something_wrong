export const stringIncludes = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  return a.toLowerCase().includes(b.toLowerCase());
}
