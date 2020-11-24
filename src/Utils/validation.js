export const stringIncludes = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  return a.toLowerCase().includes(b.toLowerCase());
}

/*
 * @function: anyIncludes
 * @description: To check if string includes input parameter
 * @param {any} The input parameter
 * @param {string} String that need to check if it includes input parameter
 * @returns {bool} if includes, return true, else return false
 * 
*/
export const anyIncludes = (a, b) => {
  if (!a || !b || typeof b !== 'string') return false;
  if (typeof a === 'string') return stringIncludes(a, b);
  if (Array.isArray(a)) return a.some(item => anyIncludes(item, b));

  // TODO: Should not use complex object like moment for this function
  if (typeof a === 'object') return anyIncludes(Object.values(a), b);
  return false;
}