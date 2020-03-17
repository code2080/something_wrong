import { combineReducers } from 'redux';

// REDUCERS
import { apiStatus } from './APIStatus/apiStatus.reducer';
import globalUI from './GlobalUI/globalUI.reducer';
import auth from './Auth/auth.reducer';
import forms from './Forms/forms.reducer';
import submissions from './FormSubmissions/formSubmissions.reducer';
import activities from './Activities/activities.reducer';
import mappings from './Mapping/mappings.reducer';
import te from './TE/te.reducer';
import users from './Users/users.reducer';

const rootReducer = combineReducers({
  apiStatus,
  globalUI,
  auth,
  forms,
  submissions,
  activities,
  mappings,
  users,
  te
});

export default rootReducer;
