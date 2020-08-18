import moment from 'moment';
import { createSelector } from 'reselect';

import { formStatus } from '../../Constants/formStatuses.constants';

const formState = state => state.forms;

export const selectForm = createSelector(
  formState,
  forms => formId => forms[formId],
);

export const selectAllForms = createSelector(
  formState,
  forms =>
    (Object.keys(forms) || [])
      .map(key => forms[key])
      .filter(form => form.status !== formStatus.ARCHIVED)
      .sort((a, b) => moment(b.updatedAt).valueOf() - moment(a.updatedAt).valueOf())
)

export const selectTimeslotsForSection = createSelector(
  formState,
  forms => (formId, sectionId) => {
    try {
      const form = forms[formId];
      const section = form.sections.find(section => section._id === sectionId);
      const { calendarSettings } = section;
      const { timeslots = [] } = calendarSettings;
      return timeslots;
    } catch (error) {
      return [];
    }
  }
);
