import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

// SELECTORS
import { selectRecipientsMap } from 'Redux/Recipients/recipients.selectors';

// ACTIONS
import { fetchRecipients as fetchRecipientsAction } from 'Redux/Recipients/recipients.actions';

export const useRecipients = () => {
  const indexedRecipients = useSelector(selectRecipientsMap());

  const dispatch = useDispatch();
  return {
    fetchRecipients: async (formInstanceIds: string[]) => {
      const recipientIds = formInstanceIds.filter(
        (id) => !indexedRecipients[id],
      );
      if (!isEmpty(formInstanceIds))
        return dispatch(
          fetchRecipientsAction({
            recipientIds,
            page: 1,
            perPage: Number.MAX_SAFE_INTEGER,
          }),
        );
      return [];
    },
  };
};
