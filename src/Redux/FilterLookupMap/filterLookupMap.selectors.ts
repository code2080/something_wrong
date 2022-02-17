import { isEmpty, keyBy } from 'lodash';
import { createSelector } from 'reselect';

const stateSelector = (state) => state.filterLookupMap;
const submissionsStateSelector = (state) => state.submissions;

export const selectFormActivityLookupMap = (formId: string) =>
  createSelector(
    stateSelector,
    (filterLookupMap) => filterLookupMap.activities[formId] ?? {},
  );

export const selectExactFormActivityLookupMap = ({ formId, filterLookupMap }) =>
  createSelector(submissionsStateSelector, (submission) => {
    if (isEmpty(filterLookupMap)) return {};
    const submissions = keyBy(submission[formId], 'recipientId');
    return {
      ...filterLookupMap,
      submitter: Object.keys(filterLookupMap.submitter || {}).reduce(
        (results, submissionId) => ({
          ...results,
          [submissions[submissionId]?.submitter ?? submissionId]:
            filterLookupMap.submitter[submissionId],
        }),
        {},
      ),
    };
  });
