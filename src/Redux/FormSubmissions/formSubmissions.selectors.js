import { createSelector } from 'reselect';
import _ from 'lodash';
import { sortTime } from '../../Components/TableColumns/Helpers/sorters';

const submissionsState = state => state.submissions;

export const selectSubmissions = createSelector(
<<<<<<< HEAD
  submissionsState,
  submissions => formId => {
    const submissionsForForm = submissions[formId] || [];
    return _.flatMap(submissionsForForm)
      .sort((a, b) => sortTime(a.updatedAt, b.updatedAt))
  }
);

export const selectFormInstance = createSelector(
  submissionsState,
  submissions => (formId, formInstanceId) => {
    const formInstance = submissions[formId][formInstanceId] || {};
    return formInstance;
  }
=======
  [getSubmissions],
  // Fix this sorted
  submissions => _.flatMap(submissions)
    .sort((a, b) => sortTime(a.updatedAt, b.updatedAt))
>>>>>>> development
);

const sectionType = {
  EMPTY: 'EMPTY',
  CONNECTED: 'CONNECTED',
  REGULAR: 'REGULAR',
  TABLE: 'TABLE',
};

const determineSectionTypeFromData = sectionData => {
  if (_.isEmpty(sectionData)) return sectionType.EMPTY;
  if (Array.isArray(sectionData)) return sectionType.REGULAR;

  const recurringSectionData = _.flatMap(sectionData);
  if (_.isEmpty(recurringSectionData)) return sectionType.EMPTY;

  if (_.head(recurringSectionData).eventId) return sectionType.CONNECTED;
  return sectionType.TABLE;
};

const extractValuesFromSectionData = sectionData => {
  switch (determineSectionTypeFromData(sectionData)) {
    case sectionType.REGULAR:
      return sectionData.reduce((values, element) => [...values, element.value], []);
    case sectionType.TABLE:
      return Object.values(sectionData).reduce((values, row) => [
        ...values,
        ...row.reduce((elVals, element) => [
          ...elVals,
          element.value
        ], [])
      ], []);
    case sectionType.CONNECTED:
      return Object.values(sectionData).reduce((values, event) => [
        ...values,
        ...event.values.reduce((elVals, element) =>
          [
            ...elVals,
            ...element.value
          ], [])
      ], []);
    default:
      return [];
  }
<<<<<<< HEAD
}
=======
};
>>>>>>> development

export const getSubmissionValues = formInstance =>
  formInstance
    ? Object.entries(formInstance.values).reduce((values, [sectionId, sectionData]) => [
      ...values,
      {
        sectionId,
        sectionValues: extractValuesFromSectionData(sectionData)
      }
    ], [])
    : [];
