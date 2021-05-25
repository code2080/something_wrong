import { createSelector } from 'reselect';

const elementStateSelector = state => state.elements;

export const selectElementTypesMap = () => createSelector(
  elementStateSelector,
  elements => elements.map,
);
