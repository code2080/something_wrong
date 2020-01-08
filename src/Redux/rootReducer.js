import { combineReducers } from 'redux';

// REDUCERS
import { apiStatus } from './APIStatus/apiStatus.reducer';
import globalUI from './GlobalUI/globalUI.reducer';
import auth from './Auth/auth.reducer';
import forms from './Forms/forms.reducer';
import submissions from './FormSubmissions/formSubmissions.reducer';
import reservations from './Reservations/reservations.reducer';
import mappings from './Mapping/mappings.reducer';
import te from './TE/te.reducer';
import integration from './Integration/integration.reducer';
import users from './Users/users.reducer';

const rootReducer = combineReducers({
  apiStatus,
  globalUI,
  auth,
  forms,
  submissions,
  reservations,
  mappings,
  users,
  te,
  integration,
});

export default rootReducer;
