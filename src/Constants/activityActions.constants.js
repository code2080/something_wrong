import { ActivityValueType } from './activityValueTypes.constants';
import { submissionValueTypes } from './submissionValueTypes.constants';
import { ActivityValueMode } from './activityValueModes.constants';
import { activityTimeModes } from './activityTimeModes.constants';
import { activityViews } from './activityViews.constants';
import { teCoreCallnames } from './teCoreActions.constants';

export const activityActions = {
  FREE_TEXT_OVERRIDE: 'FREE_TEXT_OVERRIDE',
  NUMBER_OVERRIDE: 'NUMBER_OVERRIDE',
  EXACT_TIME_OVERRIDE: 'EXACT_TIME_OVERRIDE',
  // TIMESLOT_CHANGE_OVERRIDE: 'TIMESLOT_CHANGE_OVERRIDE',
  // TIMESLOT_TO_EXACT_OVERRIDE: 'TIMESLOT_TO_EXACT_OVERRIDE',
  SELECT_OBJECT_FROM_FILTER_OVERRIDE: 'SELECT_OBJECT_FROM_FILTER_OVERRIDE',
  EDIT_OBJECT: 'EDIT_OBJECT',
  EDIT_FILTER_OVERRIDE: 'EDIT_FILTER_OVERRIDE',
  // SELECT_BEST_FIT_VALUE: 'SELECT_BEST_FIT_VALUE',
  REVERT_TO_SUBMISSION_VALUE: 'REVERT_TO_SUBMISSION_VALUE',
  SHOW_INFO: 'SHOW_INFO'
};

export const activityActionFilters = {
  [activityActions.FREE_TEXT_OVERRIDE]: activityValue =>
    activityValue.type === ActivityValueType.FIELD,
  [activityActions.NUMBER_OVERRIDE]: (activityValue, activity, mapping) =>
    activityValue.extId === 'length' &&
    mapping.timing.mode === activityTimeModes.TIMESLOTS,
  [activityActions.EXACT_TIME_OVERRIDE]: (activityValue, activity, mapping) =>
    activityValue.type === ActivityValueType.TIMING &&
    mapping.timing.mode === activityTimeModes.EXACT,
  [activityActions.TIMESLOT_CHANGE_OVERRIDE]: (
    activityValue,
    activity,
    mapping
  ) =>
    activityValue.type === ActivityValueType.TIMING &&
    mapping.timing.mode === activityTimeModes.TIMESLOTS &&
    activityValue.extId !== 'length',
  [activityActions.TIMESLOT_TO_EXACT_OVERRIDE]: (
    activityValue,
    activity,
    mapping
  ) =>
    activityValue.type === ActivityValueType.TIMING &&
    mapping.timing.mode === activityTimeModes.TIMESLOTS &&
    activityValue.extId !== 'length',
  [activityActions.SELECT_OBJECT_FROM_FILTER_OVERRIDE]: activityValue =>
    activityValue.type === ActivityValueType.OBJECT &&
    activityValue.submissionValueType === submissionValueTypes.FILTER,
  [activityActions.EDIT_OBJECT]: activityValue =>
    activityValue.type === ActivityValueType.OBJECT &&
    activityValue.submissionValueType === submissionValueTypes.OBJECT,
  [activityActions.EDIT_FILTER_OVERRIDE]: activityValue =>
    activityValue.submissionValueType === submissionValueTypes.FILTER,
  [activityActions.SELECT_BEST_FIT_VALUE]: activityValue => activityValue.submissionValueType === submissionValueTypes.FILTER,
  [activityActions.REVERT_TO_SUBMISSION_VALUE]: activityValue =>
    activityValue.valueMode === ActivityValueMode.MANUAL,
  [activityActions.SHOW_INFO]: () => true
};

export const activityActionViews = {
  [activityActions.FREE_TEXT_OVERRIDE]: activityViews.INLINE_EDIT,
  [activityActions.NUMBER_OVERRIDE]: activityViews.INLINE_EDIT,
  [activityActions.EXACT_TIME_OVERRIDE]: activityViews.INLINE_EDIT,
  [activityActions.TIMESLOT_CHANGE_OVERRIDE]: activityViews.INLINE_EDIT,
  [activityActions.TIMESLOT_TO_EXACT_OVERRIDE]: activityViews.MODAL_EDIT,
  [activityActions.SELECT_OBJECT_FROM_FILTER_OVERRIDE]:
    activityViews.EXTERNAL_EDIT,
  [activityActions.EDIT_OBJECT]: activityViews.EXTERNAL_EDIT,
  [activityActions.EDIT_FILTER_OVERRIDE]: activityViews.EXTERNAL_EDIT,
  // [activityActions.SELECT_BEST_FIT_VALUE]: activityViews.EXTERNAL_EDIT,
  [activityActions.SHOW_INFO]: activityViews.MODAL_EDIT
};

export const activityActionLabels = {
  [activityActions.FREE_TEXT_OVERRIDE]: 'Manually input value',
  [activityActions.NUMBER_OVERRIDE]: 'Manually input value',
  [activityActions.EXACT_TIME_OVERRIDE]: 'Manually select time',
  [activityActions.TIMESLOT_CHANGE_OVERRIDE]: 'Manually change timeslot',
  [activityActions.TIMESLOT_TO_EXACT_OVERRIDE]: 'Manually convert to an exact time',
  [activityActions.SELECT_OBJECT_FROM_FILTER_OVERRIDE]:
    'Manually select object',
  [activityActions.EDIT_FILTER_OVERRIDE]: 'Manually edit filter',
  [activityActions.EDIT_OBJECT]: 'Manually select object',
  // [activityActions.SELECT_BEST_FIT_VALUE]: 'Select best fit object',
  [activityActions.REVERT_TO_SUBMISSION_VALUE]: 'Revert to submission value',
  [activityActions.SHOW_INFO]: 'Show details'
};

export const externalActivityActionMapping = {
  [activityActions.SELECT_OBJECT_FROM_FILTER_OVERRIDE]:
    teCoreCallnames.REQUEST_GET_OBJECT_FROM_FILTER,
  [activityActions.EDIT_OBJECT]: teCoreCallnames.REQUEST_REPLACE_OBJECT,
  [activityActions.EDIT_FILTER_OVERRIDE]:
    teCoreCallnames.REQUEST_GET_FILTER_FROM_FILTER
  // [activityActions.SELECT_BEST_FIT_VALUE]: ,
};
