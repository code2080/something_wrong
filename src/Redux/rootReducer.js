import { combineReducers } from 'redux';

// REDUCERS
import globalUI from './GlobalUI/globalUI.reducer';
import auth from './Auth/auth.reducer';
import forms from './Forms/forms.reducer';
import submissions from './FormSubmissions/formSubmissions.reducer';
import te from './TE/te.reducer';

const rootReducer = combineReducers({
  globalUI,
  auth,
  forms,
  submissions,
  te,
});

export default rootReducer;
