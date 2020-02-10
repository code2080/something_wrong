import { datasourceValueTypes } from '../Constants/datasource.constants';

/**
 * @function transformPayloadForFiltering
 * @description transforms an internal TE Core payload to a TE Core compatible format
 * @param {Array} payload the payload to transforms
 * @returns {Object} transformedPayload
 */

export const transformPayloadForFiltering = payload => {
  if (!payload || payload.length === 0) return {};
  const type = payload.find(el => el.valueType === datasourceValueTypes.TYPE_EXTID);
  const searchString = payload.find(el => el.valueType === datasourceValueTypes.FIELD_VALUE);
  const searchField = payload.find(el => el.valueType === datasourceValueTypes.FIELD_EXTID);

  if (!type || !searchString || !searchField) return {};
  return {
    type: type.extId,
    categories: [], // TE Prefs doesn't really know what these would be
    searchString: searchString.value,
    searchFields: [searchField.extId],
  };
};
