import { createSelector } from 'reselect';
import _ from 'lodash';

export const selectExtIds = createSelector(
  [state => selectExtIdProps(state)],
  extIdProps => 
    _.flatMap(extIdProps).reduce((extIds, extIdTypes) => {
      return {
        ...extIds,
        ...extIdTypes
      }
    }, {})
);

export const selectExtIdProps = createSelector(
  state => state.te,
  te => te.extIdProps
);