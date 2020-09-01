import { createSelector } from 'reselect';
import _ from 'lodash';

const selectExtIdProps = state => state.te.extIdProps;

export const selectExtIds = createSelector(
  [selectExtIdProps],
  extIdProps => 
    _.flatMap(extIdProps).reduce((extIds, extIdTypes) => (
      [
        ...extIds,
        ...Object.keys(extIdTypes)
      ]
    ), []) || []
);

/**
 * @function selectExtIdLabel
 * @description curried function to fetch the label for the specified extId
 * @param {Object} state curried redux state
 * @param {String} field field to access of the extIdProps object (valid arguments: 'fields', 'objects', 'types')
 * @param {String} extId extId that you want to get related label from
 */
export const selectExtIdLabel = createSelector(
  /** 
   * @important extIdProps must be populated by using teCoreAPI.getExtIdProps() first
   */
  selectExtIdProps,
  extIdProps => (field, extId) => extIdProps[field][extId] ? extIdProps[field][extId].label : extId
);
