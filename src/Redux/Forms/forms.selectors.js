import { get } from 'lodash';
import moment from 'moment';
import { createSelector } from 'reselect';

import { formStatus } from '../../Constants/formStatuses.constants';

const formState = (state) => state.forms || {};
const elementState = (state) => state.elements;

export const makeSelectForm = () =>
  createSelector(
    formState,
    (_, formId) => formId,
    (forms, formId) => forms[formId] ?? {},
  );

export const selectAllForms = createSelector(formState, (forms) =>
  Object.keys(forms)
    .map((key) => forms[key])
    .filter((form) => form.status !== formStatus.ARCHIVED)
    .sort(
      (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf(),
    ),
);

export const selectTimeslotsForSection = createSelector(
  formState,
  (forms) => (formId, sectionId) => {
    try {
      const form = forms[formId];
      const section = form.sections.find(
        (section) => section._id === sectionId,
      );
      const { calendarSettings } = section;
      const { timeslots = [] } = calendarSettings;
      return timeslots;
    } catch (error) {
      return [];
    }
  },
);

export const selectSectionDesign = createSelector(
  formState,
  (forms) => (formId, sectionId) => {
    const form = forms[formId];
    return form && form.sections.find((section) => section._id === sectionId);
  },
);

export const selectSectionHasAvailabilityCalendar = (sectionElements) =>
  createSelector(elementState, (elements) =>
    sectionElements.some(
      (elem) =>
        elements.map[elem.elementId] &&
        elements.map[elem.elementId].type === 'ELEMENT_TYPE_CALENDAR',
    ),
  );

export const selectElementType = (formId, sectionId, elementId) =>
  createSelector(formState, elementState, (forms, elements) => {
    const form = forms[formId];
    if (!form) return null;
    const section = form.sections.find(({ _id }) => _id === sectionId);
    if (!section) return null;
    const element = section.elements.find(({ _id }) => _id === elementId);
    if (!element) return null;
    return get(elements.map, [element.elementId, 'type']);
  });
