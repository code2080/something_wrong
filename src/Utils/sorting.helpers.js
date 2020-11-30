import { sortAlpha } from "../Components/TableColumns/Helpers/sorters";

const getElementHtml = (element) => {
  if (typeof element.innerHTML === 'string') return element.innerHTML;
  if (element.children && element.children.length) {
    return getElementHtml(element.children[0]);
  }
  return '';
};
export const sortByElementHtml = (a, b) => {
  const elementA = document.querySelector(a);
  const elementB = document.querySelector(b);
  return sortAlpha(getElementHtml(elementA), getElementHtml(elementB));
};
