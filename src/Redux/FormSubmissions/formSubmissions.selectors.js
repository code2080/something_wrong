import { createSelector } from 'reselect';

const getSubmissions = (state, formId) => state.submissions[formId];

export const selectSubmissions = createSelector(
    [getSubmissions],
    submissions => Object.keys(submissions || []).map(
        key => submissions[key]
    )
);
