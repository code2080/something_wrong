import { isEmpty } from 'lodash';
import { selectIndexedFormSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import { createSelector } from 'reselect';

const stateSelector = (state) => state.filterLookupMap;

export const selectFormActivityLookupMap = (formId: string) =>
  createSelector(
    stateSelector,
    (filterLookupMap) => filterLookupMap.activities[formId] ?? {},
  );

export const selectExactFormActivityLookupMap = ({ formId, filterLookupMap }) =>
  createSelector(selectIndexedFormSubmissions(formId), (indexedSubmissions) => {
    if (isEmpty(filterLookupMap)) return {};
    return {
      ...filterLookupMap,
      submitter: Object.keys(filterLookupMap.submitter || {}).reduce(
        (results, submissionId) => ({
          ...results,
          [indexedSubmissions[submissionId]?.submitter ?? submissionId]:
            filterLookupMap.submitter[submissionId],
        }),
        {},
      ),
    };
  });
