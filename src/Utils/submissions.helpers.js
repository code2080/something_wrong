import _ from 'lodash';
import { SECTION_TABLE } from '../Constants/sectionTypes.constants';
import { determineSectionType } from './determineSectionType.helpers';
import { formatElementValue } from './elements.helpers';

export const flattenSectionValue = (valueGroup) => {
  if (Array.isArray(valueGroup)) {
    return valueGroup.map((item) => formatElementValue(item.value));
  } else if (typeof valueGroup === 'object') {
    const b = Object.values(valueGroup).map((value) => {
      if (Array.isArray(value)) {
        return value.map((val) => formatElementValue(val.value));
      }
      return (value.values || []).map((item) => formatElementValue(item.value));
    });
    return b;
  }
};

export const flattenValues = (formInstance) => {
  const { values } = formInstance;
  return Object.keys(values).reduce((results, key) => {
    const valueGroup = values[key];
    const sectionValues = flattenSectionValue(valueGroup);
    return {
      ...results,
      [key]: _.flattenDeep(sectionValues),
    };
  }, {});
  // const a = Object.values(values).map(valueGroup => {
  //   if (Array.isArray(valueGroup)) {
  //     return valueGroup.map(item => formatElementValue(item.value))
  //   } else if (typeof valueGroup === 'object') {
  //     const b = Object.values(valueGroup).map(value => {
  //       if (Array.isArray(value)) {
  //         return value.map(val => formatElementValue(val.value))
  //       }
  //       return (value.values || []).map(item => formatElementValue(item.value));
  //     });
  //     return b;
  //   }
  // });
  // return _.flattenDeep(a);
  // return Object.values(formInstance.values).map(item => {
  //   if (Array.isArray(item)) {
  //     // return item.map(({ value }) => console.log(value) || (value || []).map(val => val ? Object.keys(val) : '').join('|')).join('|')
  //     return '';
  //   }
  //   if (typeof item === 'object') {
  //     return Object.values(item).map(evt => evt.values.map(val => val.value).join('|'))
  //   }
  //   return '';
  // }).join('|');
  // return '';
};

/** function parseFormSectionValues
 * @description convert submissions value to form section values
 * @param {Object} values: the values from db
 * @param {Array} sections: form sections
 */
export const parseFormSectionValues = (formInstanceValues, formSections) => {
  const indexedFormSections = _.keyBy(formSections, '_id');
  return {
    ...Object.keys(formInstanceValues).reduce((results, sectionId) => {
      const foundSection = indexedFormSections[sectionId];
      if (!foundSection) return results;
      const sectionType = determineSectionType(foundSection);
      if (sectionType === SECTION_TABLE) {
        // UPDATE FOR OLD FORM INSTANCE VALUES;
        const keys = Object.keys(formInstanceValues[sectionId]);
        if (
          formInstanceValues[sectionId][keys[0]] &&
          !Array.isArray(formInstanceValues[sectionId][keys[0]].values)
        ) {
          return {
            ...results,
            [sectionId]: {
              ...keys.reduce((values, key) => {
                return {
                  ...values,
                  [key]: {
                    values: formInstanceValues[sectionId][key],
                  },
                };
              }, {}),
            },
          };
        }
      }
      return {
        ...results,
        [sectionId]: formInstanceValues[sectionId],
      };
    }, {}),
  };
};

export const convertToSubmissionsFilterQuery = (filters, options = {}) => {
  const { userId } = options;
  const results = {};
  if (_.isEmpty(filters)) return results;
  if (filters.onlyOwn) results['teCoreProps.assignedTo'] = userId;
  if (filters.onlyStarred) results['teCoreProps.isStarred'] = true;
  if (filters.freeTextFilter) results.freetext = filters.freeTextFilter;
  return results;
};
