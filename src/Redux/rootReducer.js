import { combineReducers } from 'redux';
import _ from 'lodash';

// REDUCERS
import { apiStatus } from './APIStatus/apiStatus.reducer';
import globalUI from './GlobalUI/globalUI.reducer';
import filters from './Filters/filters.reducer';
import auth from './Auth/auth.reducer';
import forms from './Forms/forms.reducer';
import submissions from './FormSubmissions/formSubmissions.reducer';
import activities from './Activities/activities.reducer';
import activityDesigner from './ActivityDesigner/activityDesigner.reducer';
import activityGroups from './ActivityGroup/activityGroup.reducer';
import objectRequests from './ObjectRequests/ObjectRequests.reducer';
import jobs from './Jobs/jobs.reducer';
import manualSchedulings from './ManualSchedulings/manualSchedulings.reducer';
import te from './TE/te.reducer';
import users from './Users/users.reducer';
import integration from './Integration/integration.reducer';
import elements from './Elements/elements.reducer';
import constraints from './Constraints/constraints.reducer';
import { LOGOUT } from './Auth/auth.actionTypes';

const appReducer = combineReducers({
  apiStatus,
  globalUI,
  auth,
  forms,
  filters,
  submissions,
  activities,
  activityDesigner,
  activityGroups,
  jobs,
  manualSchedulings,
  users,
  te,
  integration,
  objectRequests,
  elements,
  constraints
});

const rootReducer = (state, action) => {
  // Clear all data in redux store to initial.
  if (action.type === LOGOUT) {
    const tmpEnv = _.get(state, 'auth.env');
    state = Object.assign({
      auth: {
        env: tmpEnv
      }
    });
  }
  return appReducer(state, action);
};

export default rootReducer;
