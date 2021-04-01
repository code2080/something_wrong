import _ from 'lodash';
// CONSTANTS
import { activityStatuses } from '../Constants/activityStatuses.constants';
import { teCoreCallnames } from '../Constants/teCoreActions.constants';
import { ActivityValue, CategoryField } from '../Types/ActivityValue.type';
import { ActivityValueType } from '../Constants/activityValueTypes.constants';
import {
  TEField,
  TEObject,
  TEObjectFilter,
} from '../Types/TECorePayloads.type';
import { TActivity } from '../Types/Activity.type';
import { derivedFormattedValueForActivityValue } from './ActivityValues';

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

export const getTimingModeForActivity = (activity) => {
  try {
    const aV = activity.timing.find((el) => el.extId === 'mode');
    return aV.value;
  } catch (error) {
    return null;
  }
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
    .filter(
      (activity) => activity.activityStatus === activityStatuses.SCHEDULED,
    )
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

export const activityIsReadOnly = (status) =>
  [activityStatuses.SCHEDULED, activityStatuses.QUEUED].includes(status);

const mapActivityValueToTEValue = (
  activityValue: ActivityValue,
): TEField | TEObjectFilter | TEObject[] | null => {
  const { value, type, extId } = activityValue;
  switch (type) {
    case ActivityValueType.FIELD:
      return new TEField(extId, value as string[]);
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
): { fields: TEField[]; objects: [TEObject | TEObjectFilter] } =>
  _(activityValues)
    .filter((av) => av.value)
    .map(mapActivityValueToTEValue)
    .reduce<any>(
      (
        payload: { fields: TEField[]; objects: [TEObjectFilter | TEObject] },
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
            objects: [...payload.objects, ...value],
          };
        } else {
          return payload;
        }
      },
      { fields: [], objects: [] },
    );

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
  return [...extIds, 'groupId', 'submitter', 'primaryObject'];
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
      extId: 'groupId',
      value: activity.groupId,
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
  ];

  // Get all the activity values
  const values = [...activity.timing, ...activity.values, ...consts].filter(
    (el) => extIds.indexOf(el.extId) > -1,
  );
  // Product a non unique ret val
  const retVal = values.reduce(
    (tot, activityValue) => {
      const { extId } = activityValue;
      const formattedOptions: any = derivedFormattedValueForActivityValue(
        activityValue,
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

const mergeAndMakeUniqOptions = (a, b) => {
  if ((Array.isArray(a) && a.length) || (Array.isArray(b) && b.length))
    return _.uniqBy([...(a || []), ...(b || [])], 'value');
  return [...Object.keys(a || {}), ...Object.keys(b || {})].reduce(
    (tot, key) => ({
      ...tot,
      [key]: _.uniqBy(
        [...(a ? a[key] || [] : []), ...(b ? b[key] || [] : [])],
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
  const extIds = getAllExtIdsFromActivityValues(actArr[0]);

  // Iterate over each activity and get its formatted value together with the activity id
  const retVal = actArr.reduce(
    (tot, activity) => {
      const [options, matches] = extractValueFromActivity(activity, extIds);
      const updOptions = extIds.reduce(
        (tot, extId) => ({
          ...tot,
          [extId]: mergeAndMakeUniqOptions(tot[extId], options[extId]),
        }),
        tot.options,
      );
      const updMatches = [...Object.keys(tot.matches), ...matches].reduce(
        (tot, matchKey) => ({
          ...tot,
          [matchKey]: [
            ...(tot[matchKey] || []),
            ...(matches.indexOf(matchKey) > -1 ? [activity._id] : []),
          ],
        }),
        tot.matches,
      );
      return {
        options: updOptions,
        matches: updMatches,
      };
    },
    { options: {}, matches: {} },
  );
  return retVal;
};
