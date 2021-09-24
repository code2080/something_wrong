import _, { keyBy } from 'lodash';
// CONSTANTS
import { EActivityStatus } from '../Types/ActivityStatus.enum';
import {
  TConstraintConfiguration,
  TConstraintInstance,
} from '../Types/ConstraintConfiguration.type';
import { teCoreCallnames } from '../Constants/teCoreActions.constants';
import { ActivityValue, CategoryField } from '../Types/ActivityValue.type';
import { ActivityValueType } from '../Constants/activityValueTypes.constants';
import {
  TEField,
  TEObject,
  TEObjectFilter,
} from '../Types/TECorePayloads.type';
import { TActivity } from '../Types/Activity.type';
import { TFormInstance } from '../Types/FormInstance.type';
import type { TFilterLookUpMap } from '../Types/FilterLookUp.type';
import { ObjectRequest } from '../Redux/ObjectRequests/ObjectRequests.types';
import { derivedFormattedValueForActivityValue } from './ActivityValues';
import {
  ConflictType,
  JointTeachingConflictMapping,
  SUPPORTED_VALUE_TYPES,
} from 'Models/JointTeachingGroup.model';
// CONSTANTS
// FUNCTIONS
/**
 * @function ensureBackwardsCompatibleActivityDesign
 * @description ensures all activity design is backwards compatible and coered to look lik [[elementPath], [elementPath]]
 * @param {*} activityDesign the activity design to assert
 */
export const ensureBackwardsCompatibleValueRow = (valueRow) => {
  /**
   * Updating object format to require double arrays to store multiple mappings for each type
   * To ensure compatibility with old forms, we coerce non-double arrays
   */
  if (!valueRow || valueRow == null || !Array.isArray(valueRow)) return [[]];
  if (!valueRow[0] || !Array.isArray(valueRow[0])) return [valueRow];
  return valueRow;
};

export const getTimingModeForActivity = (activity: TActivity) => {
  const aV = activity.timing.find((el) => el.extId === 'mode');
  return aV?.value ?? null;
};

/**
 * @function findObjectPathForActivityValue
 * @description finds the path (timing or values) for a value for a certain extId
 * @param {String} valueExtId the extId of the value we're looking for
 * @param {Object} activity the activity with all its values
 * @returns {String} values || timing
 */
export const findObjectPathForActivityValue = (valueExtId, activity) => {
  const timingIdx = activity.timing.findIndex((el) => el.extId === valueExtId);
  if (timingIdx > -1) return 'timing';
  const valueIdx = activity.values.findIndex((el) => el.extId === valueExtId);
  if (valueIdx > -1) return 'values';
  return null;
};

/**
 * Validates that all activities that is scheduled has existing reservation in core,
 * and sets NOT_SCHEDULED if reservation not found
 * @param {array} activities Activities to validate
 * @param {object} teCoreAPI
 * @param {object} dispatch
 */
export const validateScheduledActivities = (activities, teCoreAPI) => {
  const reservationIds = activities
    .filter((activity) => activity.activityStatus === EActivityStatus.SCHEDULED)
    .map((activity) => activity.reservationId);

  teCoreAPI[teCoreCallnames.VALIDATE_RESERVATIONS]({
    reservationIds,
    callback: ({ res: { invalidReservations } }) => {
      const invalidActivityIds = invalidReservations.map((resId) => {
        const activityWithInvalidReservation = activities.find(
          (activity) => activity.reservationId === resId,
        );
        return activityWithInvalidReservation._id;
      });
      console.log('Found these invalid activities:', invalidActivityIds);
    },
  });
};

export const hydrateObjectRequests = (
  activity: TActivity,
  objectRequests: ObjectRequest[],
) => {
  return {
    ...activity,
    values: activity.values.map((av: ActivityValue) => ({
      ...av,
      value: Array.isArray(av.value)
        ? av.value
            .map((val) => {
              const req = _.find(objectRequests, ['_id', val]);
              return req ? req.replacementObjectExtId : val;
            })
            .filter((val) => val != null)
        : av.value,
    })),
  };
};

export const activityIsReadOnly = (status) =>
  // TODO: Temporarily disables editing activities until we ensure it works again
  true || [EActivityStatus.SCHEDULED, EActivityStatus.QUEUED].includes(status);

const mapActivityValueToTEValue = (
  activityValue: ActivityValue,
): TEField | TEObjectFilter | TEObject[] | null => {
  const { value, type, extId } = activityValue;
  switch (type) {
    case ActivityValueType.FIELD:
      return new TEField(extId, [value] as string[]);
    case ActivityValueType.OBJECT: {
      // Array means it's an array of objectextids, object means that it's an objectfilter
      return Array.isArray(value)
        ? (value as string[]).map((objExtId) => new TEObject(extId, objExtId))
        : new TEObjectFilter(
            extId,
            (value as CategoryField).categories.map(
              ({ id, values }) => new TEField(id, values),
            ),
          );
    }
    default:
      return null;
  }
};

export const extractValuesFromActivityValues = (
  activityValues: ActivityValue[],
): { fields: TEField[]; objects: (TEObject | TEObjectFilter)[] } => {
  const payload = _(activityValues)
    .filter((av: ActivityValue) => !!av.value)
    .map(mapActivityValueToTEValue)
    .reduce<{ fields: TEField[]; objects: (TEObject | TEObjectFilter)[] }>(
      (
        payload: { fields: TEField[]; objects: (TEObjectFilter | TEObject)[] },
        value: TEField | TEObjectFilter | TEObject[] | null,
      ) => {
        if (value instanceof TEField) {
          return {
            ...payload,
            fields: [...payload.fields, value],
          };
        } else if (value instanceof TEObjectFilter) {
          return {
            ...payload,
            objects: [...payload.objects, value],
          };
        } else if (Array.isArray(value)) {
          return {
            ...payload,
            objects: _.uniqBy(
              [...payload.objects, ...value.filter((obj) => obj.id != null)],
              'id',
            ),
          };
        } else {
          return payload;
        }
      },
      { fields: [], objects: [] },
    );
  const [objFilters, objects]: [any, any] = _.partition(
    payload.objects,
    (obj) => obj instanceof TEObjectFilter,
  );

  // DEV-8061: Remove all duplicated TEObjects
  return {
    ...payload,
    objects: [
      ...(objFilters as TEObjectFilter[]),
      ..._.uniqBy(objects as TEObject[], 'id'),
    ],
  };
};

const getAllExtIdsFromActivityValues = (
  sampleActivity: TActivity,
): string[] => {
  const allActivityValues = [
    ...sampleActivity.timing,
    ...sampleActivity.values,
  ];
  const extIds = allActivityValues
    .filter((el) => el.extId && el.extId !== '$init')
    .map((el) => el.extId);
  return [...extIds, 'tagId', 'submitter', 'primaryObject'];
};

const extractMatchesFromFormattedOptions = (
  formattedOptions: any,
): string[] => {
  if (Array.isArray(formattedOptions))
    return formattedOptions.map((el) => el.value);
  return Object.keys(formattedOptions).reduce(
    (tot: string[], key) => [
      ...tot,
      ...formattedOptions[key].map((el) => el.value),
    ],
    [],
  );
};

const mergeOptions = (formattedOptions, existingOptions) => {
  // If array => simple merge
  if (Array.isArray(formattedOptions))
    return [...existingOptions, ...formattedOptions];
  // If not array, more complicated merge..
  return [
    ...Object.keys(formattedOptions),
    ...Object.keys(existingOptions),
  ].reduce(
    (tot, key) => ({
      ...tot,
      [key]: [
        ...(formattedOptions[key] || []),
        ...(existingOptions[key] || []),
      ],
    }),
    [],
  );
};

const createUniqOptions = (option) => {
  if (!option || option == null) return [];
  if (Array.isArray(option)) return _.uniq(option);
  return Object.keys(option).reduce(
    (tot, key) => ({
      ...tot,
      [key]: _.uniqBy(option[key], 'value'),
    }),
    {},
  );
};

const extractValueFromActivity = (
  activity: TActivity,
  extIds: string[],
): [{ [extId: string]: any }, any[]] => {
  // Add constants from the activity
  const consts = [
    {
      extId: 'tagId',
      value: activity.tagId,
      type: ActivityValueType.OTHER,
      formId: activity.formId,
    },
    {
      extId: 'submitter',
      value: activity.formInstanceId,
      type: ActivityValueType.OTHER,
      formId: activity.formId,
    },
    {
      extId: 'primaryObject',
      value: activity.formInstanceId,
      type: ActivityValueType.OTHER,
      formId: activity.formId,
    },
  ] as (ActivityValue & { formId?: string })[];
  // Get all the activity values
  const values = [...activity.timing, ...activity.values, ...consts].filter(
    (value) => extIds.includes(value.extId),
  );
  // Produce a non unique ret val
  const retVal = values.reduce<{
    options: { [extid: string]: any[] };
    matches: string[];
  }>(
    (tot, activityValue) => {
      const { extId } = activityValue;
      const formattedOptions: any = derivedFormattedValueForActivityValue(
        activityValue as ActivityValue,
        activity,
      );
      if (!formattedOptions) return tot;
      const matches = extractMatchesFromFormattedOptions(formattedOptions);

      return {
        ...tot,
        options: {
          ...tot.options,
          [extId]: mergeOptions(formattedOptions, tot.options[extId] || []),
        },
        matches: [...tot.matches, ...matches],
      };
    },
    { options: {}, matches: [] },
  );

  // Make the retval unique
  const matches = _.uniq(retVal.matches || []);
  const options = extIds.reduce(
    (tot, extId) => ({
      ...tot,
      [extId]: createUniqOptions(retVal.options[extId]),
    }),
    {},
  );
  return [options, matches];
};

const mergeAndMakeUniqOptions = (
  updatedOptions,
  currentOptions,
): { [key: string]: any } | any[] => {
  if (_.isEmpty(updatedOptions) && _.isEmpty(currentOptions)) return [];
  if (
    (Array.isArray(updatedOptions) && updatedOptions.length) ||
    (Array.isArray(currentOptions) && currentOptions.length)
  )
    return _.uniqBy(
      [...(updatedOptions || []), ...(currentOptions || [])],
      'value',
    );
  return [
    ...Object.keys(updatedOptions || {}),
    ...Object.keys(currentOptions || {}),
  ].reduce(
    (tot, key) => ({
      ...tot,
      [key]: _.uniqBy(
        [
          ...(updatedOptions ? updatedOptions[key] || [] : []),
          ...(currentOptions ? currentOptions[key] || [] : []),
        ],
        'value',
      ),
    }),
    {},
  );
};

export const getFilterPropsForActivities = (activities: any) => {
  // Ensure we have activities
  if (!activities) return [null, null];
  // Convert the activities to an array
  const actArr: TActivity[] = (Object.keys(activities) || []).reduce(
    (tot: TActivity[], key: string) => [...tot, ...(activities[key] || [])],
    [],
  );
  if (!actArr || !actArr.length) return [null, null];
  // Extract all the ext ids from a sample activity
  /**
   * @TODO WE SHOULD ADD BACK GROUP, SUBMITTER, ETC AS THESE ARE NOT EXTIDS
   */
  const availableProperties = getAllExtIdsFromActivityValues(actArr[0]);

  // Iterate over each activity and get its formatted value together with the activity id
  return actArr.reduce(
    (props, activity) => {
      const [currentOptions, currentMatches] = extractValueFromActivity(
        activity,
        availableProperties,
      );

      const updOptions = availableProperties.reduce(
        (updatedOptions, property) => ({
          ...updatedOptions,
          [property]: mergeAndMakeUniqOptions(
            updatedOptions[property],
            currentOptions[property],
          ),
        }),
        props.options,
      );

      const updMatches = [
        ...Object.keys(props.matches),
        ...currentMatches,
      ].reduce(
        (tot, matchKey) => ({
          ...tot,
          [matchKey]: [
            ...(tot[matchKey] || []),
            ...(currentMatches.includes(matchKey) ? [activity._id] : []),
          ],
        }),
        props.matches,
      );

      return {
        options: updOptions,
        matches: updMatches,
      };
    },
    { options: {}, matches: {} },
  );
};

const getValuesForActivity = (
  activity: TActivity,
  submission: TFormInstance,
  activityTags: any,
) => {
  return activity && submission
    ? {
        id: activity._id,
        submitter: {
          id: submission.recipientId,
          label: `${submission.firstName} ${submission.lastName}`,
        },
        primaryObject: { id: submission.scopedObject },
        tag: {
          id: activity.tagId,
          label: _.find(activityTags, ['_id', activity.tagId])?.name ?? 'N/A',
        },
      }
    : null;
};

const mergeSimpleData = (currentSubmissionData, newSubmitter, id: string) => ({
  ...currentSubmissionData,
  [newSubmitter.id]: {
    label: newSubmitter.label,
    activityIds: [
      ...(currentSubmissionData?.[newSubmitter.id]?.activityIds || []),
      id,
    ],
  },
});

const mergeSimpleDataField =
  (currentData, newData) => (field: 'tag' | 'submitter' | 'primaryObject') => {
    return mergeSimpleData(currentData[field], newData[field], newData.id);
  };

export const getFilterLookupMap = (
  submissions: { [id: string]: TFormInstance },
  activities: TActivity[],
  activityTags: any,
): TFilterLookUpMap => {
  // Map activities to filter values
  const filterValues = _.compact(
    activities.map((activity) =>
      getValuesForActivity(
        activity,
        submissions[activity.formInstanceId],
        activityTags,
      ),
    ),
  );
  // Merge the filter values into a lookup map
  return filterValues.reduce<TFilterLookUpMap>((mergedFilters, filterValue) => {
    const curriedMergeSimpleDataOfField = mergeSimpleDataField(
      mergedFilters,
      filterValue,
    );
    return {
      ...mergedFilters,
      submitter: curriedMergeSimpleDataOfField('submitter'),
      tag: curriedMergeSimpleDataOfField('tag'),
      primaryObject: curriedMergeSimpleDataOfField('primaryObject'),
    };
  }, <TFilterLookUpMap>{});
};

export const activityFilterFn = {
  canBeScheduled: (activity: TActivity) =>
    !activity.reservationId &&
    ![EActivityStatus.SCHEDULED, EActivityStatus.QUEUED].includes(
      activity.activityStatus,
    ),
  canBeSelected: (activity: TActivity) =>
    !!activity.reservationId &&
    activity.activityStatus === EActivityStatus.SCHEDULED,
  canBeStopped: (activity: TActivity) =>
    activity.activityStatus === EActivityStatus.QUEUED,
};

export const activityConvertFn = {
  toDeleted: (activity: TActivity): TActivity => ({
    ...activity,
    schedulingTimestamp: null,
    activityStatus: EActivityStatus.NOT_SCHEDULED,
    reservationId: null,
  }),
};

const isFieldConstraint = (constraint: TConstraintInstance) =>
  constraint.parameters.find(
    ({ firstParam, lastParam }) =>
      firstParam && lastParam && firstParam.length > 0 && lastParam.length > 0,
  );

const getFieldConstraintValue = (
  submission: TFormInstance,
  sectionId: string,
  elementId: string,
): null | number => {
  const activityValue = submission.values[sectionId].find(
    (value) => value.elementId === elementId,
  );
  if (!activityValue) return null;
  const value = activityValue.value;
  if (!value || isNaN(value)) return null;
  return value;
};

export const populateWithFieldConstraint = ({
  activities,
  constraintConfiguration,
  submissions,
}: {
  activities: TActivity[];
  constraintConfiguration?: TConstraintConfiguration | null;
  submissions?: TFormInstance[] | null;
}): TActivity[] => {
  if (!constraintConfiguration || !submissions) return activities;
  const fieldConstraint =
    constraintConfiguration.constraints.find(isFieldConstraint);
  // Missing field constraint
  if (!fieldConstraint) return activities;
  const { operator, parameters } = fieldConstraint;
  // @ts-ignore
  const { firstParam, lastParam } = _.head(parameters);
  const [, typeExtId, fieldExtId] = lastParam;
  const [, sectionId, elementId] = firstParam;
  // Incomplete object or form mapping
  if (!typeExtId || !fieldExtId || !sectionId || !elementId || !operator)
    return activities;
  const objectField = { typeExtId, fieldExtId };

  return activities.map((activity) => {
    const { formInstanceId } = activity;
    const submission = submissions.find(({ _id }) => _id === formInstanceId);
    if (!submission) return activity;
    const value = getFieldConstraintValue(submission, sectionId, elementId);
    const fieldConstraintData = { objectField, operator, value };
    return { ...activity, fieldConstraint: fieldConstraintData };
  });
};

const getValuesType = (values) => {
  if (Array.isArray(values)) return _.uniq(values.map((val) => typeof val));
  return [typeof values];
};

const getAllValuesFromActivities = (type, activities) => {
  const allValues: { [extId: string]: null | ActivityValue[] } = {};
  activities.forEach((act) => {
    const indexedValues = keyBy(act[type], 'extId');
    Object.values(activities[0][type] as ActivityValue[]).forEach((item) => {
      const valueTypes = getValuesType(item.value);
      const unsupportedTypes = _.difference(valueTypes, SUPPORTED_VALUE_TYPES);
      if (unsupportedTypes.length) {
        allValues[item.extId] = null;
      } else if (Array.isArray(allValues[item.extId])) {
        if (
          !allValues[item.extId]?.some((val) =>
            _.isEqual(val.value, indexedValues[item.extId].value),
          )
        ) {
          allValues[item.extId]?.push(indexedValues[item.extId]);
        }
      } else {
        allValues[item.extId] = [indexedValues[item.extId]];
      }
    });
  });
  return allValues;
};

export const getUniqueValues = (activities: TActivity[]) => {
  if (_.isEmpty(activities))
    return {
      values: {},
      timing: {},
    };
  // const allValues: {[extId: string]: null | ActivityValue[]} = {};
  // activities.forEach((act) => {
  //   const indexedValues = keyBy(act[type], 'extId');
  //   Object.values(activities[0]).forEach((item) => {
  //     const valueTypes = getValuesType(item.value);
  //     const unsupportedTypes = _.difference(valueTypes, SUPPORTED_VALUE_TYPES);
  //     if (unsupportedTypes.length) {
  //       allValues[item.extId] = null;
  //     }
  //     else if (Array.isArray(allValues[item.extId])) {
  //       if (!allValues[item.extId]?.some(val => _.isEqual(val.value, indexedValues[item.extId].value))) {
  //         allValues[item.extId]?.push(indexedValues[item.extId]);
  //       }
  //     } else {
  //       allValues[item.extId] = [indexedValues[item.extId]];
  //     }
  //   });
  // });
  return {
    [ConflictType.VALUES]: getAllValuesFromActivities(
      ConflictType.VALUES,
      activities,
    ),
    [ConflictType.TIMING]: getAllValuesFromActivities(
      ConflictType.TIMING,
      activities,
    ),
  };
  // return Object.keys(allValues).reduce((results, key) => {
  //   return {
  //     ...results,
  //   }
  // }, {});
  // return Object.values(allValues).map((values) =>
  //   _.uniqWith(values, (a: ActivityValue, b: ActivityValue) => {
  //     return a && b && _.isEqual(a.value, b.value);
  //   }),
  // );
};
export const getConflictsResolvingStatus = (
  activities: TActivity[],
  conflicts: JointTeachingConflictMapping,
) => {
  const uniqueValues = getUniqueValues(activities);
  return Object.keys(uniqueValues).every((type) => {
    const typeValues = uniqueValues[type];
    return Object.keys(typeValues).every((extId) => {
      const val = typeValues[extId];
      if (_.isEmpty(val) || val.length === 1) return true;
      return conflicts[type]?.[extId];
    });
  });
};

export const calculateActivityConflictsByType = (
  type: ConflictType,
  activities: TActivity[],
  _selectedValues: { [type: string]: { [key: string]: string } },
) => {
  const uniqueValues = getUniqueValues(activities);
  const selectedValues = _selectedValues[type];
  return Object.keys(uniqueValues[type] || {}).reduce((results, key) => {
    const _values = uniqueValues[type]?.[key];
    if (!_values) return results;

    // If only one value
    if (_values.length === 1)
      return {
        ...results,
        [key]: _values[0],
      };

    const foundActivity = activities.find(
      (act) => act._id === selectedValues[key],
    );
    if (!foundActivity) return results;

    // If multiple values
    return {
      ...results,
      [key]: foundActivity[type].find((val) => val.extId === key),
    };
  }, {});
};

export const calculateActivityConflicts = (
  activities: TActivity[],
  selectedValues: { [type: string]: { [key: string]: string } },
) => {
  return {
    values: calculateActivityConflictsByType(
      ConflictType.VALUES,
      activities,
      selectedValues,
    ),
    timing: calculateActivityConflictsByType(
      ConflictType.TIMING,
      activities,
      selectedValues,
    ),
  };
};
