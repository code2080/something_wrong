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
