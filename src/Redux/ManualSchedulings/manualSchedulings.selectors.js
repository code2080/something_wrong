import { createSelector } from 'reselect';
import _ from 'lodash';
import { determineSectionType } from '../../Utils/sections.helpers';

import { manualSchedulingStatuses, manualSchedulingFormStatuses } from '../../Constants/manualSchedulingConstants';
import { SECTION_CONNECTED, SECTION_TABLE } from '../../Constants/sectionTypes.constants';

const mSState = state => state.manualSchedulings;
const formInstanceState = state => state.submissions;
const formState = state => state.forms;

export const selectManualSchedulingForFormInstance = createSelector(
  mSState,
  mS => formInstanceId => mS[formInstanceId],
);

export const selectManualSchedulingStatusForRow = createSelector(
  mSState,
  mS => (formInstanceId, sectionId, rowKey) => _.get(mS, `${formInstanceId}.${sectionId}.${rowKey}`, manualSchedulingStatuses.NOT_COMPLETED)
);

const calculateMSRows = (values, sections) =>
  (Object.keys(values) || [])
    .filter(sectionId => {
      const section = sections.find(section => section._id === sectionId);
      const sectionType = determineSectionType(section);
      return sectionType === SECTION_CONNECTED || sectionType === SECTION_TABLE;
    })
    .reduce((rows, sectionId) => rows + (Object.keys(values[sectionId]) || []).length, 0)

export const selectManualSchedulingStatus = createSelector(
  mSState,
  formInstanceState,
  formState,
  (mS, formInstances, forms) => (formInstanceId, formId) => {
    try {
      // Get the form instance's ms status
      const formInstanceMS = mS[formInstanceId];
      // Get completed schedulings
      const completedSchedulings = (Object.keys(formInstanceMS) || []).reduce((c, sectionId) =>
        c + (Object.keys(formInstanceMS[sectionId]) || [])
          .filter(rowKey => formInstanceMS[sectionId][rowKey] === manualSchedulingStatuses.COMPLETED)
          .length,
      0);
      // Get the form instance
      const formInstance = formInstances[formId][formInstanceId];
      const form = forms[formInstance.formId];
      const mSRows = calculateMSRows(formInstance.values, form.sections);

      const status = completedSchedulings === 0
        ? manualSchedulingFormStatuses.NOT_STARTED
        : completedSchedulings === mSRows
          ? manualSchedulingFormStatuses.COMPLETED
          : completedSchedulings + 1 === mSRows
            ? manualSchedulingFormStatuses.ONE_AWAY
            : manualSchedulingFormStatuses.IN_PROGRESS;
      return { completed: completedSchedulings, totalRows: mSRows, status };
    } catch (error) {
      return { completed: 0, totalRows: 0, status: manualSchedulingFormStatuses.NOT_STARTED };
    }
  }
);
