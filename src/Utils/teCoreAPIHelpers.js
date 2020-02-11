import { datasourceValueTypes } from '../Constants/datasource.constants';
import { searchCriteriaFreeText, searchCriteriaNumber, searchCriteriaNumberProps } from '../Constants/searchCriteria.constants';

/**
 * @function transformPayloadForDatasourceFiltering
 * @description transforms an internal TE Core payload to a TE Core compatible format
 * @param {Array} payload the payload to transforms
 * @returns {Object} transformedPayload
 */

export const transformPayloadForDatasourceFiltering = payload => {
  if (!payload || payload.length === 0) return {};
  const type = payload.find(el => el.valueType === datasourceValueTypes.TYPE_EXTID);
  const searchString = payload.find(el => el.valueType === datasourceValueTypes.FIELD_VALUE);
  const searchField = payload.find(el => el.valueType === datasourceValueTypes.FIELD_EXTID);

  if (!type || !searchString || !searchField) return null;
  return {
    type: type.extId,
    categories: [{ id: searchField.extId, values: [searchString.value] }],
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
  if (searchCriteria === searchCriteriaFreeText.CONTAINS)
    return {
      type: type.extId,
      categories: [],
      searchString: searchString.value,
      searchFields: [searchField.extId],
    };
  return {
    type: type.extId,
    categories: [{ id: searchField.extId, values: [searchString.value] }], // TE Prefs doesn't really know what these would be
    searchString: null,
    searchFields: null,
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
  if (!payload || payload.length === 0) return {};
  const type = payload.find(el => el.valueType === datasourceValueTypes.TYPE_EXTID);
  const searchString = payload.find(el => el.valueType === datasourceValueTypes.FIELD_VALUE);
  const searchField = payload.find(el => el.valueType === datasourceValueTypes.FIELD_EXTID);
  if (!type || !searchString || !searchField) return null;
  return {
    type: type.extId,
    categories: [],
    searchString: `${searchCriteriaNumberProps[searchCriteria].label}${searchString.value}`,
    searchFields: [searchField.extId],
  };
};
