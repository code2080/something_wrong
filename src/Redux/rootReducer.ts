import { combineReducers } from 'redux';
import _ from 'lodash';

// REDUCERS
import { apiStatus } from './APIStatus/apiStatus.reducer';
import globalUI from './GlobalUI/globalUI.reducer';
import auth from './Auth/auth.reducer';
import submissions from './FormSubmissions/formSubmissions.reducer';
import activityDesigner from './ActivityDesigner/activityDesigner.reducer';
import constraintConfigurations from './ConstraintConfigurations/constraintConfigurations.reducer';
import objectRequests from './ObjectRequests/ObjectRequests.reducer';
import jobs from './Jobs/jobs.reducer';
import manualSchedulings from './ManualSchedulings/manualSchedulings.reducer';
import te from './TE/te.reducer';
import users from './Users/users.reducer';
import integration from './Integration/integration.reducer';
import elements from './Elements/elements.reducer';
import constraints from './Constraints/constraints.reducer';
import jointTeaching from './JointTeaching/jointTeaching.reducer';
import activityScheduling from './ActivityScheduling/activityScheduling.reducer';
import recipients from './Recipients/recipients.reducer';
import filters from './Filters/filters.reducer';

// DEPRECATED
// import activityTags from './DEPR_ActivityTag/activityTag.reducer';
// import activities from './DEPR_Activities/activities.reducer';
// import filterLookupMap from './DEPR_FilterLookupMap/filterLookupMap.reducer';
// import forms from './DEPR_Forms/forms.reducer';

// ACTIONS
import { LOGOUT } from './Auth/auth.actionTypes';

// REWORKED
import activitiesReducer from './Activities';
import tagsReducer from './Tags';
import formsReducer from './Forms';

const appReducer = combineReducers({
  apiStatus,
  globalUI,
  auth,
  submissions,
  activityDesigner,
  constraintConfigurations,
  jobs,
  manualSchedulings,
  users,
  te,
  integration,
  objectRequests,
  elements,
  constraints,
  jointTeaching,
  activityScheduling,
  recipients,
  filters,
  activities: activitiesReducer,
  tags: tagsReducer,
  forms: formsReducer,
});

const rootReducer = (state, action) => {
  // Clear all data in redux store to initial.
  if (action.type === LOGOUT) {
    const tmpEnv = _.get(state, 'auth.env');
    state = Object.assign({
      auth: {
        env: tmpEnv,
      },
    });
  }
  return appReducer(state, action);
};

export default rootReducer;
