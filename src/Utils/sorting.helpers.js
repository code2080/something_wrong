import { sortAlpha } from '../Components/TableColumns/Helpers/sorters';

const getElementHtml = (element, isDeep) => {
  if (!element) return '';
  if (isDeep) {
    if (element.children && element.children.length) {
      return getElementHtml(element.children[0]);
    }
  }
  if (typeof element.innerHTML === 'string') return element.innerHTML;
  return '';
};

const sortValue = (valueA, valueB) => {
  if (!isNaN(valueA) && !isNaN(valueB)) return Number(valueA) - Number(valueB);
  return sortAlpha(valueA, valueB);
};
export const sortByElementHtml = (a, b) => {
  const elementA = document.querySelector(a);
  const elementB = document.querySelector(b);
  return sortValue(getElementHtml(elementA), getElementHtml(elementB));
};
export const sortByElementDeepHtml = (a, b) => {
  const elementA = document.querySelector(a);
  const elementB = document.querySelector(b);
  return sortValue(getElementHtml(elementA, true), getElementHtml(elementB, true));
};

export const sortByActivityGroup = (a, b) => {
  if (!a.groupId) return -1;
  if (!b.groupId) return 1;
  if (a.groupId === b.groupId) return 0;
  return sortAlpha(a.groupId, b.groupId);
};
