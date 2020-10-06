import { combineReducers } from 'redux';

// REDUCERS
import { apiStatus } from './APIStatus/apiStatus.reducer';
import globalUI from './GlobalUI/globalUI.reducer';
import filters from './Filters/filters.reducer';
import auth from './Auth/auth.reducer';
import forms from './Forms/forms.reducer';
import submissions from './FormSubmissions/formSubmissions.reducer';
import activities from './Activities/activities.reducer';
import manualSchedulings from './ManualSchedulings/manualSchedulings.reducer';
import activityDesigner from './ActivityDesigner/activityDesigner.reducer';
import te from './TE/te.reducer';
import users from './Users/users.reducer';
import integration from './Integration/integration.reducer';
import objectRequests from './ObjectRequests/ObjectRequests.reducer';

const rootReducer = combineReducers({
  apiStatus,
  globalUI,
  auth,
  forms,
  filters,
  submissions,
  activities,
  manualSchedulings,
  activityDesigner,
  users,
  te,
  integration,
  objectRequests,
});

export default rootReducer;
