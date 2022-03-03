import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

// SELECTORS
import { selectAllSubmissionsForForm } from 'Redux/FormSubmissions/formSubmissions.selectors';

// ACTIONS
import { fetchFormSubmissions } from 'Redux/FormSubmissions/formSubmissions.actions';

export const useSubmissions = ({ formId }: { formId: string }) => {
  const indexedSubmissions = useSelector(selectAllSubmissionsForForm(formId));

  const dispatch = useDispatch();
  return {
    fetchSubmissions: async (formInstanceIds: string[]) => {
      const submissionIds = formInstanceIds.filter(
        (id) => !indexedSubmissions[id],
      );
      if (!isEmpty(submissionIds))
        return dispatch(
          fetchFormSubmissions(formId, {
            formInstanceIds: submissionIds,
          }),
        );
      return [];
    },
  };
};
