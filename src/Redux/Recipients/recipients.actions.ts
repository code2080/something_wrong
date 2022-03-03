import { getEnvParams } from 'configs';
import { asyncAction } from 'Utils/actionHelpers';
import * as types from './recipients.actionTypes';

const fetchRecipientsFlow = {
  request: () => ({ type: types.FETCH_RECIPIENTS_REQUEST }),
  success: (response) => ({
    type: types.FETCH_RECIPIENTS_SUCCESS,
    payload: { ...response },
  }),
  failure: (err) => ({
    type: types.FETCH_RECIPIENTS_FAILURE,
    payload: { ...err },
  }),
};

export const fetchRecipients = (payload) => {
  const { recipientIds, ...rest } = payload;
  return asyncAction.GET({
    flow: fetchRecipientsFlow,
    endpoint: `${getEnvParams().API_URL}recipients/raw`,
    params: { _id: recipientIds, ...rest },
  });
};
