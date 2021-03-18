import _ from 'lodash';
import { ActivityTiming } from '../Models/ActivityTiming.model';
import { ActivityDesign } from '../Models/ActivityDesign.model';

export const checkObjectIsInvalid = (object) => {
  if (_.isEmpty(object)) return false;
  return Object.keys(object).some((key) => {
    const item = object[key];
    if (!item || _.isEmpty(item)) return true;
    if (Array.isArray(item))
      return item.some((subItem) => !subItem || _.isEmpty(subItem));
    return false;
  });
};

export const resetMenuOptions = {
  RESET_EMPTY: 'RESET_EMPTY',
  RESET_TYPES: 'RESET_TYPES',
  RESET_FIELDS: 'RESET_FIELDS',
  RESET_ALL: 'RESET_ALL',
};

export const resetEmpty = () => ({
  timing: new ActivityTiming({}),
  objects: {},
  fields: {},
  propSettings: {},
});

export const resetAll = (typeOptions, fieldOptions) => ({
  timing: new ActivityTiming({}),
  objects: typeOptions.reduce(
    (prev, type) => ({ ...prev, [type.value]: null }),
    {},
  ),
  fields: fieldOptions.reduce(
    (prev, field) => ({ ...prev, [field.value]: null }),
    {},
  ),
  propSettings: {
    ...typeOptions.reduce(
      (prev, type) => ({ ...prev, [type.value]: { mandatory: false } }),
      {},
    ),
    ...fieldOptions.reduce(
      (prev, field) => ({ ...prev, [field.value]: { mandatory: false } }),
      {},
    ),
  },
});

export const resetFields = (mapping, fieldOptions) => ({
  ...mapping,
  fields: fieldOptions.reduce(
    (prev, field) => ({ ...prev, [field.value]: null }),
    {},
  ),
  propSettings: {
    ...mapping.propSettings,
    ...fieldOptions.reduce(
      (prev, field) => ({ ...prev, [field.value]: { mandatory: false } }),
      {},
    ),
  },
});

export const resetTypes = (mapping, typeOptions) => ({
  ...mapping,
  objects: typeOptions.reduce(
    (prev, type) => ({ ...prev, [type.value]: null }),
    {},
  ),
  propSettings: {
    ...mapping.propSettings,
    ...typeOptions.reduce(
      (prev, type) => ({ ...prev, [type.value]: { mandatory: false } }),
      {},
    ),
  },
});

export const extractReservationTypes = (payload) => {
  if (!payload.subtypes || !payload.subtypes.length) return [];
  return payload.subtypes.map((el) => ({ label: el.name, value: el.extid }));
};

export const extractReservationFields = (payload) =>
  payload.map((el) => ({ label: el.name, value: el.extid }));

export const parseTypeOptions = (validTypes, availableTypes) => {
  if (validTypes.length > 0)
    return validTypes.map((value) => ({
      value,
      label: (
        availableTypes.find((el) => el.value === value) || { label: value }
      ).label,
    }));
  return availableTypes;
};

export const parseFieldOptions = (validFields, availableFields) => {
  if (validFields.length > 0)
    return validFields.map((value) => ({
      value,
      label: (
        availableFields.find((el) => el.value === value) || { label: value }
      ).label,
    }));
  return availableFields;
};

export const updateTimingPropOnActivityDesign = (design, formId, prop, value) =>
  new ActivityDesign({
    ...design,
    formId: formId,
    name: `Mapping for ${formId}`,
    timing: {
      ...design.timing,
      [prop]: value,
    },
  });

export const updateObjectPropOnActivityDesign = (
  design,
  formId,
  objectDesign,
) => ({
  ...design,
  formId: formId,
  name: `Mapping for ${formId}`,
  objects: {
    ...objectDesign.objects,
  },
  propSettings: {
    ...objectDesign.propSettings,
  },
});

export const updateFieldPropOnActivityDesign = (
  design,
  formId,
  fieldDesign,
) => ({
  ...design,
  formId: formId,
  name: `Mapping for ${formId}`,
  fields: {
    ...fieldDesign.fields,
  },
  propSettings: {
    ...fieldDesign.propSettings,
  },
});
