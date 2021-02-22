import { createSelector } from 'reselect';
import _ from 'lodash';
import { sortTime } from '../../Components/TableColumns/Helpers/sorters';

const submissionsState = state => state.submissions;

export const selectSubmissions = createSelector(
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
);
