import _, { isEmpty } from 'lodash';
import { ActivityValueType } from '../../Constants/activityValueTypes.constants';
import { TActivity } from '../../Types/Activity/Activity.type';
import { ActivityValue, ValueType } from '../../Types/Activity/ActivityValue.type';
import { submissionValueTypes } from '../../Constants/submissionValueTypes.constants';
import {
  elementTypeMappingById,
  elementTypeValueFormatter,
} from '../../Constants/elementTypes.constants';
import { extractValuesFromActivityValues } from '../activities.helpers';
import {
  TGetExtIdPropsPayload,
  TEField,
  TEObject,
  TEObjectFilter,
} from '../../Types/TECorePayloads.type';

const filterTypes = {
  CATEGORIES: 'CATEGORIES',
  SEARCH_STRING: 'SEARCH_STRING',
};

/**
 * @function getTimeModeForActivity
 * @description Get timing mode (EXACT, TIMESLOTS, SEQUENCE) for activity
 * @param {Activity} activity
 * @returns string
 */
export const determineTimeModeForActivity = (
  activity: TActivity,
): ValueType => {
  const aV = activity.timing.find((el) => el.extId === 'mode');
  return aV?.value ?? null;
};

/**
 * @function determineObjectValueContent
 * @description asserts which type of content the activityValue.value contains
 * @param {Object} activityValue the activity value to be assessed
 * @returns {String} value type (enum of submissionValueTypes)
 */
export const determineObjectValueContent = (activityValue: ActivityValue) => {
  if (activityValue.type !== ActivityValueType.OBJECT) return null;
  if (Array.isArray(activityValue.value)) return submissionValueTypes.OBJECT;
  return submissionValueTypes.FILTER;
};

/**
 * @function normalizeFilterValue
 * @description normalize a filter value to an array of { fieldExtId: String, value: JoinedString }
 * @param {*} value the filter value
 * @param {*} filterType the type of filter (SEARCH_STRING | CATEGORIES)
 * @returns array
 */
export const normalizeFilterValue = (value, filterType) => {
  switch (filterType) {
    case filterTypes.CATEGORIES:
      return value.categories.reduce((tot, acc) => {
        return [...tot, { fieldExtId: acc.id, values: acc.values.join(', ') }];
      }, []);
    case filterTypes.SEARCH_STRING:
    default: {
      const { searchFields, searchString } = value;
      if (!searchFields || !searchString) return null;
      return [{ fieldExtId: searchFields, values: searchString }];
    }
  }
};

/**
 * @function normalizeFilterValues
 * @description normalize a full array of filter values
 * @param {*} value the filter values
 * @returns array
 */
export const normalizeFilterValues = (value: any[]) => {
  const normalizedValues = value.reduce((tot, acc) => {
    const filterType = acc.categories.length
      ? filterTypes.CATEGORIES
      : filterTypes.SEARCH_STRING;
    const normalizedFilterValue = normalizeFilterValue(acc, filterType);
    if (normalizedFilterValue) return [...tot, ...normalizedFilterValue];
    return tot;
  }, []);
  return normalizedValues;
};

const fvForActivityTag = (tagId: string | null | undefined, formId: string) => {
  if (!tagId) return 'N/A';
  const storeState = (window as any).tePrefsLibStore.getState();
  const activityTags = _.get(storeState, `activityTags.${formId}`, []);
  const activityTag = activityTags.find((el) => el._id === tagId);
  if (!activityTag) return 'N/A';
  return activityTag.name;
};

const fvForSubmitter = (formInstanceId: string, formId: string) => {
  const storeState = (window as any).tePrefsLibStore.getState();
  const formInstance = _.get(
    storeState,
    `submissions.${formId}.${formInstanceId}`,
    null,
  );
  if (!formInstance) return 'N/A';
  return `${formInstance.firstName} ${formInstance.lastName}`;
};

const fvForPrimaryObject = (formInstanceId: string, formId: string) => {
  const storeState = (window as any).tePrefsLibStore.getState();
  const scopedObject = _.get(
    storeState,
    `submissions.${formId}.${formInstanceId}.scopedObject`,
    null,
  );
  if (!scopedObject) return 'N/A';
  return scopedObject;
};

export const getFVForOtherValue = (activityValue: any): any[] | null => {
  const { value, extId, formId } = activityValue;
  switch (extId) {
    case 'tagId': {
      const fv = fvForActivityTag(value, formId);
      return [{ value: `${extId}/${value}`, label: fv }];
    }

    case 'submitter': {
      const fv = fvForSubmitter(value, formId);
      return [{ value: `${extId}/${value}`, label: fv }];
    }

    case 'primaryObject': {
      const fv = fvForPrimaryObject(value, formId);
      return [{ value: `${extId}/${fv}`, label: fv }];
    }

    default:
      return null;
  }
};

const extractExtIdsFromValues = (values: {
  fields: TEField[];
  objects: (TEObject | TEObjectFilter)[];
}): TGetExtIdPropsPayload => {
  const [objectIds, objFilters]: [any[], any[]] = _.partition(
    values.objects,
    (obj) => obj instanceof TEObject,
  );
  const objFilterData = objFilters.reduce<{
    fields: TEField[];
    types: string[];
  }>(
    (objFilterData, objFilter: TEObjectFilter) => ({
      fields: [...objFilterData.fields, ...objFilter.fields],
      types: [...objFilterData.types, objFilter.type],
    }),
    { fields: [], types: [] },
  );
  const fieldIds = [...values.fields, ...objFilterData.fields].map(
    (f) => f.fieldExtId,
  );
  const objectTypes = objectIds.map((obj: TEObject) => obj.type);
  return {
    objects: _.uniqWith(
      objectIds as TEObject[],
      (o1, o2) => o1.type === o2.type && o1.id === o2.id,
    ),
    fields: _.uniq(fieldIds),
    types: _.uniq([...objFilterData.types, ...objectTypes]),
  };
};

export const getExtIdsFromActivities = (
  activities: TActivity[],
): TGetExtIdPropsPayload => {
  if (_.isEmpty(activities)) return { objects: [], fields: [], types: [] };
  const activityValues = _(activities)
    .flatMap()
    .map((a) => a.values as ActivityValue[])
    .flatMap()
    .value();

  const values = extractValuesFromActivityValues(activityValues);
  const extIds = extractExtIdsFromValues(values);
  return extIds;
};

export const getActivityValuesBasedOnElement = (
  activityValues: ActivityValue[],
  sections = [],
) => {
  if (isEmpty(activityValues)) return activityValues;
  const mapping = sections.reduce((results, section: any) => {
    return {
      ...results,
      [section._id]: (section.elements || []).reduce(
        (elemResults, elm) => ({
          ...elemResults,
          [elm._id]: elementTypeMappingById[elm.elementId],
        }),
        {},
      ),
    };
  }, {});
  if (isEmpty(mapping)) return activityValues;
  return activityValues.map((aValue) => {
    if (aValue.sectionId && aValue.elementId) {
      const elementType = mapping[aValue.sectionId]?.[aValue.elementId];
      return {
        ...aValue,
        value: Array.isArray(aValue.value)
          ? aValue.value.map((val) =>
              elementTypeValueFormatter(elementType, val),
            )
          : elementTypeValueFormatter(elementType, aValue.value),
        submissionValue: Array.isArray(aValue.submissionValue)
          ? aValue.submissionValue.map((val) =>
              elementTypeValueFormatter(elementType, val),
            )
          : elementTypeValueFormatter(elementType, aValue.submissionValue),
      };
    }
    return aValue;
  });
};
