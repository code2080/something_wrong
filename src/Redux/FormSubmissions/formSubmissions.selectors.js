import { createSelector } from 'reselect';
import _ from 'lodash';
import { sortTime } from '../../Components/TableColumns/Helpers/sorters';

const getSubmissions = (state, formId) => state.submissions[formId];

export const selectSubmissions = createSelector(
    [getSubmissions],
    // Fix this sorted
    submissions => _.flatMap(submissions)
    .sort((a, b) => sortTime(a.updatedAt, b.updatedAt))
);

const sectionType = {
  EMPTY: 'EMPTY',
  CONNECTED: 'CONNECTED',
  REGULAR: 'REGULAR',
  TABLE: 'TABLE',
}

const determineSectionTypeFromData = sectionData => {
  if (_.isEmpty(sectionData)) return sectionType.EMPTY;
  if (Array.isArray(sectionData)) return sectionType.REGULAR;

  const recurringSectionData = _.flatMap(sectionData);
  if (_.isEmpty(recurringSectionData)) return sectionType.EMPTY;

  if (_.head(recurringSectionData).eventId) return sectionType.CONNECTED;
  return sectionType.TABLE;
}

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
  }

export const getSubmissionValues = (formId, formInstanceId) => createSelector(
  state => Object.values(state.submissions[formId][formInstanceId].values),
  sections =>
    sections.reduce((values, sectionData) => [...values, ...extractValuesFromSectionData(sectionData)], [])
);