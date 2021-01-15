import _ from 'lodash';
import { formatElementValue } from './elements.helpers';

export const flattenSectionValue = valueGroup => {
  if (Array.isArray(valueGroup)) {
    return valueGroup.map(item => formatElementValue(item.value))
  } else if (typeof valueGroup === 'object') {
    const b = Object.values(valueGroup).map(value => {
      if (Array.isArray(value)) {
        return value.map(val => formatElementValue(val.value))
      }
      return (value.values || []).map(item => formatElementValue(item.value));
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
