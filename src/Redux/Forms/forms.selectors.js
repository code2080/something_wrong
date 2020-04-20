import { createSelector } from 'reselect';

const formState = state => state.forms;

export const selectForm = createSelector(
  formState,
  forms => formId => forms[formId],
);

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
