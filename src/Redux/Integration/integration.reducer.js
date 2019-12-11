import * as types from './integration.actionTypes';
import _ from 'lodash';
// INITIAL STATE
import { initialState } from './integration.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_INTEGRATION_SETTINGS_SUCCESS:
      const mapping = _.get(action.payload, 'objectList.integrationSetting.applicationSettings.tePref.objectTypes', {});
      return {
        ...state,
        mapping,
      };

    default:
      return state;
  }
}

export default reducer;
