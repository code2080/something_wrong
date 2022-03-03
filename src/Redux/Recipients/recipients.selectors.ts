import { createSelector } from 'reselect';

const stateSelector = (state) => state.recipients;

export const selectRecipientsMap = () =>
  createSelector(stateSelector, (recipients) => recipients.map);
