import axios from 'axios';
import _, { flatMap, groupBy, isEmpty, keyBy, partition } from 'lodash';
import { Activity } from '../Models/Activity.model';
import { getToken } from './tokenHelpers';

// CONSTANTS
import { EActivityStatus } from '../Types/Activity/ActivityStatus.enum';
import {
  TConstraintConfiguration,
  TConstraintInstance,
} from '../Types/ConstraintConfiguration.type';
import { teCoreCallnames } from '../Constants/teCoreActions.constants';
import {
  ActivityValue,
  CategoryField,
  IndexedActivityValueType,
  ValueType,
} from '../Types/Activity/ActivityValue.type';
import { ActivityValueType } from '../Constants/activityValueTypes.constants';
import {
  TEField,
  TEObject,
  TEObjectFilter,
  TPopulateSelectionPayload,
} from '../Types/TECorePayloads.type';
import { TActivity } from '../Types/Activity/Activity.type';
import { TFormInstance } from '../Types/FormInstance.type';
import type { TFilterLookUpMap } from '../Types/DEPR_FilterLookUp.type';
import { ObjectRequest } from '../Redux/ObjectRequests/ObjectRequests.types';
import { derivedFormattedValueForActivityValue } from './ActivityValues';
import {
  ConflictType,
  JointTeachingConflictMapping,
  NOT_SUPPORTED_ELEMENT_TYPES,
  SUPPORTED_VALUE_TYPES,
} from 'Models/JointTeachingGroup.model';
import { isEmptyDeep } from './general.helpers';
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
import { convertToUrlParams } from '../Redux/DEPR_Activities/activities.actions';
import { getEnvParams } from 'configs';
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
  [EActivityStatus.SCHEDULED, EActivityStatus.QUEUED].includes(status);

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
  _.compact(constraint.parameters || []).find(
    ({ firstParam, lastParam }) =>
      firstParam && lastParam && firstParam.length > 0 && lastParam.length > 0,
  );

const getFieldConstraintValue = (
  submission: TFormInstance,
  sectionId: string,
  elementId: string,
  eventIdOrRowIdx: string | null,
): null | number => {
  const submissionValues = submission.values[sectionId];

  // Regular section is just the values array, while recurring sections are objects with eventId or rowIdx as key
  const isRegularSection = Array.isArray(submissionValues);

  const values = isRegularSection
    ? submissionValues
    : submissionValues[eventIdOrRowIdx as string]?.values;

  // If we have regular section we will find the value with only id
  const elementValue = values.find((value) => value.elementId === elementId);

  const value = elementValue?.value;
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
    const { formInstanceId, eventId, rowIdx } = activity;
    const submission = submissions.find(({ _id }) => _id === formInstanceId);
    if (!submission) return activity;
    const value = getFieldConstraintValue(
      submission,
      sectionId,
      elementId,
      eventId ?? rowIdx,
    );
    const fieldConstraintData = { objectField, operator, value };
    return { ...activity, fieldConstraint: fieldConstraintData };
  });
};

const getValuesType = (values) => {
  if (Array.isArray(values)) {
    if (values.length > 1) return ['array'];
    return _.uniq(values.map((val) => typeof val));
  }

  return [typeof values];
};

/**
 * @function getAllValuesFromActivities
 * @description get all uniq values from activities
 * @description If activity value is not string or number[], or has more than 1 elements, return null
 * @param {ConflictType} type
 * @param {TActivity[]} activities
 * @param {undefined | {[key: string]: string}} elementTypeMapping
 * @return {IndexedActivityValueType}
 */
export const getAllValuesFromActivities = (
  type: ConflictType,
  activities: TActivity[],
  elementTypeMapping?: { [key: string]: string },
): IndexedActivityValueType => {
  const allValues = {};
  const allActivitiesValues = activities.flatMap((act) => act[type]);
  const groupedValuesByExtId = groupBy(allActivitiesValues, 'extId');
  const unsupportedExtIds = Object.keys(groupedValuesByExtId).filter(
    (extId: string) => {
      const valuesOfExtId = groupedValuesByExtId[extId];
      return valuesOfExtId.some((val: ActivityValue) => {
        const valueTypes = getValuesType(val.value);
        const unsupportedTypes = _.difference(
          valueTypes,
          SUPPORTED_VALUE_TYPES,
        );
        const elementType = elementTypeMapping?.[val.elementId as string];
        return (
          unsupportedTypes.length ||
          (elementType && NOT_SUPPORTED_ELEMENT_TYPES.includes(elementType)) ||
          (Array.isArray(val.value) && val.value.length > 1)
        );
      });
    },
  );

  activities.forEach((act) => {
    const indexedValues = keyBy(act[type], 'extId');
    Object.values(activities[0][type] as ActivityValue[]).forEach((item) => {
      if (unsupportedExtIds.includes(item.extId)) {
        allValues[item.extId] = null;
      } else if (Array.isArray(allValues[item.extId])) {
        if (
          !allValues[item.extId]?.some((val) =>
            _.isEqual(val?.value, indexedValues[item.extId]?.value),
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
/**
 * @function getUniqueValues
 * @description Return all uniqued activities values
 * @param {TActivity[]} activities
 * @param {undefined | {[key: string]: string}} elementTypeMapping
 * @return {[type: ConflictType]: string[]}
 */
export const getUniqueValues = (
  activities: TActivity[],
  elementTypeMapping?: { [key: string]: string },
): { [conflictType in ConflictType]: IndexedActivityValueType } => {
  const initialValues = { values: {}, timing: {} };
  if (_.isEmpty(activities))
    return Object.values(ConflictType).reduce(
      (results, type) => ({
        ...results,
        [type]: [],
      }),
      initialValues,
    );

  return Object.values(ConflictType).reduce(
    (results, type) => ({
      ...results,
      [type]: getAllValuesFromActivities(type, activities, elementTypeMapping),
    }),
    initialValues,
  );
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
/**
 * @function calculateActivityConflictsByType
 * @description
 * @param {ConflictType} type
 * @param {TActivity[]} activities
 * @param {({
 *     [type: string]: { [key: string]: Array<ValueType | undefined> };
 *   })} _selectedValues
 * @return {{ [key: string]: ActivityValueType }}
 */
export const calculateActivityConflictsByType = (
  type: ConflictType,
  activities: TActivity[],
  _selectedValues: {
    [type: string]: { [key: string]: Array<ValueType | undefined> };
  },
): { [key: string]: ActivityValueType } => {
  const uniqueValues = getUniqueValues(activities);
  const selectedValues = _selectedValues[type];
  return Object.keys(uniqueValues[type] || {}).reduce((results, key) => {
    const _values = uniqueValues[type]?.[key];
    if (!_values) return results;

    // If only one value
    if (_values.length === 1)
      return {
        ...results,
        [key]: _values[0].value,
      };
    return {
      ...results,
      [key]: flatMap(selectedValues[key]),
    };
  }, {});
};

export const calculateActivityConflicts = (
  activities: TActivity[],
  selectedValues: {
    [type: string]: { [key: string]: Array<ValueType | undefined> };
  },
) => {
  return Object.values(ConflictType).reduce(
    (results, type) => ({
      ...results,
      [type]: calculateActivityConflictsByType(
        type,
        activities,
        selectedValues,
      ),
    }),
    {},
  ) as { [key in ConflictType]: ActivityValueType };
};

const schemaQueriesMapping = {
  [UNMATCHED_ACTIVITIES_TABLE]: {
    matchedJointTeachingId: null,
    // TODO: Workaround solution. Need to ask BE for some api changes.
    'jointTeaching.object': {
      $exists: true,
    },
  },
};

export const getActivityFilterSchemaQuery = ({ status }, tableType) => {
  const queryFromMap = schemaQueriesMapping[tableType] || {};
  const schemaQuery = {
    ...queryFromMap,
    activityStatus: isEmpty(status)
      ? undefined
      : {
          $in: status,
        },
  };
  if (isEmptyDeep(schemaQuery)) return undefined;
  return schemaQuery;
};

export const getActivities = async ({
  activityIds,
  formInstanceIds,
}: {
  activityIds?: string[];
  formInstanceIds?: string[];
}): Promise<TActivity[]> => {
  if (isEmpty(activityIds) && isEmpty(formInstanceIds)) return [];
  const token = await getToken();
  const response = await axios.get(`${getEnvParams().AM_BE_URL}activity`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`,
    },
    params: { activityIds: activityIds, formInstanceIds },
  });

  // TODO: add proper error handling
  return (response?.data?.activities ?? [])
    .filter((a) => !isEmpty(a.values))
    .map((a) => new Activity(a));
};

type GetActivitiesWithFilterResponse = {
  activities: TActivity[];
  totalActivities: number;
  totalPages: number;
};

export const getActivitiesByFormIdWithFilter = async (
  formId,
  { filter, options, fields = {} },
): Promise<GetActivitiesWithFilterResponse> => {
  const transformFilter = convertToUrlParams({
    ...filter,
    ...options,
    fields,
  });
  const token = await getToken();
  const response = await axios.get(
    `${getEnvParams().AM_BE_URL}forms/${formId}/activities`,
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${token}`,
      },
      params: transformFilter,
    },
  );

  return response.data;
};

export const deleteReservationAsync = (
  activities,
  teCoreAPI,
): Promise<TActivity[]> =>
  new Promise((resolve, reject) => {
    try {
      teCoreAPI.deleteReservations({
        activities,
        callback: () => resolve(activities.map(activityConvertFn.toDeleted)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatedMultipleActivity = async (
  activities: TActivity[],
): Promise<TActivity[]> => {
  const token = await getToken();
  const response = await axios.put(
    `${getEnvParams().AM_BE_URL}activity`,
    { activities },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const hydrateObjectRequestsFromValuePayload = (
  valuepayload: Pick<TPopulateSelectionPayload, 'objects' | 'fields'>,
  objReqs: ObjectRequest[],
) => {
  const [objFilters, objs]: [any[], any[]] = partition(
    valuepayload.objects,
    (obj) => obj instanceof TEObjectFilter,
  );
  const withObjReqs = {
    ...valuepayload,
    objects: [
      ...(objFilters as TEObjectFilter[]),
      ...(objs as TEObject[]).map((obj) => {
        const objReq = objReqs.find((req: ObjectRequest) => req._id === obj.id);
        return objReq
          ? ({
              ...obj,
              id: objReq?.replacementObjectExtId ?? obj.id,
            } as TEObject)
          : obj;
      }),
    ],
  };
  return withObjReqs;
};
