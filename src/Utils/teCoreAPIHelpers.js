import { datasourceValueTypes } from '../Constants/datasource.constants';
import { searchCriteriaFreeText, searchCriteriaNumber, searchCriteriaNumberProps } from '../Constants/searchCriteria.constants';

/**
 * @function transformPayloadForDatasourceFiltering
 * @description transforms an internal TE Preferences payload to a TE Core compatible format
 * @param {Array} payload the payload to transforms
 * @returns {Object} transformedPayload
 */

export const transformPayloadForDatasourceFiltering = payload => {
  // No payload is a no-op
  if (!payload || payload.length === 0) return {};
  // There can only be one type, so we can safely use find
  const type = payload.find(el => el.valueType === datasourceValueTypes.TYPE_EXTID);
  // No type is a no-op
  if (!type) return null;
  // There can be multiple filters, so need to use Array.prototype.filter
  const searchString = payload.filter(el => el.valueType === datasourceValueTypes.FIELD_VALUE);
  const categories = (searchString || []).reduce((prev, curr) => [...prev, { id: curr.extId, values: curr.value }], []);
  return {
    type: type.extId,
    categories,
    searchString: null,
    searchFields: null,
  };
};

/**
 * @function transformPayloadForFreeTextFiltering
 * @description transforms an internal TE Core payload to a TE Core compatible format
 * @param {*} payload the original payload
 * @param {*} searchCriteria the search criteria to be used
 * @returns {Object} transformedPayload
 */

export const transformPayloadForFreeTextFiltering = (payload, searchCriteria = searchCriteriaFreeText.CONTAINS) => {
  if (!payload || payload.length === 0) return {};
  const type = payload.find(el => el.valueType === datasourceValueTypes.TYPE_EXTID);
  const searchString = payload.find(el => el.valueType === datasourceValueTypes.FIELD_VALUE);
  const searchField = payload.find(el => el.valueType === datasourceValueTypes.FIELD_EXTID);
  if (!type || !searchString || !searchField) return null;
  return {
    type: type.extId,
    categories: [],
    exactSearch: searchCriteria !== searchCriteriaFreeText.CONTAINS,
    searchString: searchString.value,
    searchFields: [searchField.extId],
  };
};

/**
 * @function transformPayloadForNumberFiltering
 * @description transforms an internal TE Core payload to a TE Core compatible format
 * @param {*} payload the original payload
 * @param {*} searchCriteria the search criteria to be used
 * @returns {Object} transformedPayload
 */

export const transformPayloadForNumberFiltering = (payload, searchCriteria = searchCriteriaNumber.EQUAL_TO) => {
  // No payload is a no-op
  if (!payload || payload.length === 0) return {};
  // There can only be one type, so we can safely use find
  const type = payload.find(el => el.valueType === datasourceValueTypes.TYPE_EXTID);
  // No type is a no-op
  if (!type) return null;
  // There can be multiple filters, so need to use Array.prototype.filter
  const searchStrings = payload.filter(el => el.valueType === datasourceValueTypes.FIELD_VALUE);
  // Make sure we have one element in the search string
  if (!searchStrings || !searchStrings.length) return null;

  return {
    type: type.extId,
    categories: [],
    searchString: `${searchCriteriaNumberProps[searchCriteria].label}${searchStrings[0].value}`,
    searchFields: [searchStrings[0].extId],
  };
};
