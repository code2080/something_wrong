import { createSelector } from 'reselect';
import _ from 'lodash';
import { sortTime } from '../../Components/TableColumns/Helpers/sorters';

const submissionsState = (state) => state.submissions || {};

export const makeSelectSubmissions = () =>
  createSelector(
    submissionsState,
    (_, formId) => formId,
    (submissions, formId) => {
      const submissionsForForm = submissions[formId] || {};
      return _.flatMap(submissionsForForm).sort((a: any, b: any) =>
        sortTime(a.updatedAt, b.updatedAt),
      );
    },
  );

export const selectFormInstance = createSelector(
  submissionsState,
  (submissions) => (formId, formInstanceId) => {
    const submissionsForForm = submissions[formId] || {};
    return submissionsForForm[formInstanceId] || {};
  },
);
