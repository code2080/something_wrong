import { combineReducers } from 'redux';
import _ from 'lodash';

// REDUCERS
import { apiStatus } from './APIStatus/apiStatus.reducer';
import globalUI from './GlobalUI/globalUI.reducer';
import auth from './Auth/auth.reducer';
import submissions from './FormSubmissions/formSubmissions.reducer';
import activityDesigner from './ActivityDesigner/activityDesigner.reducer';
import objectRequests from './ObjectRequests/ObjectRequests.reducer';
import manualSchedulings from './ManualSchedulings/manualSchedulings.reducer';
import te from './TE/te.reducer';
import users from './Users/users.reducer';
import integration from './Integration/integration.reducer';
import elements from './Elements/elements.reducer';
import jointTeaching from './JointTeaching/jointTeaching.reducer';
import recipients from './Recipients/recipients.reducer';
import filters from './Filters/filters.reducer';

// DEPRECATED
// import activityTags from './DEPR_ActivityTag/activityTag.reducer';
// import activities from './DEPR_Activities/activities.reducer';
// import filterLookupMap from './DEPR_FilterLookupMap/filterLookupMap.reducer';
// import forms from './DEPR_Forms/forms.reducer';
// import jobs from './DEPR_Jobs/jobs.reducer';
// import constraintConfigurations from './ConstraintConfigurations/constraintConfigurations.reducer';
// import constraints from './DEPR_Constraints/constraints.reducer';
import activityScheduling from './DEPR_ActivityScheduling/activityScheduling.reducer';

// ACTIONS
import { LOGOUT } from './Auth/auth.actionTypes';

// REWORKED
import activitiesReducer from './Activities';
import tagsReducer from './Tags';
import formsReducer from './Forms';
import jobsReducer from './Jobs';
import constraintProfilesReducer from './ConstraintProfiles';
import constraintsReducer from './Constraints';

const appReducer = combineReducers({
  apiStatus,
  globalUI,
  auth,
  submissions,
  activityDesigner,
  manualSchedulings,
  users,
  te,
  integration,
  objectRequests,
  elements,
  jointTeaching,
  recipients,
  filters,
  activityScheduling,
  activities: activitiesReducer,
  tags: tagsReducer,
  forms: formsReducer,
  jobs: jobsReducer,
  constraintProfiles: constraintProfilesReducer,
  constraints: constraintsReducer,
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
