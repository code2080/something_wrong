import FormInstance from '../../Models/FormInstance.model';
import FormInstanceTECoreProps from '../../Models/FormInstanceTECoreProps.model';
import * as types from './formSubmissions.actionTypes';

// INITIAL STATE
import initialState from './formSubmissions.initialState';

// MODELS

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_SUBMISSIONS_FOR_FORM_SUCCESS: {
      if (
        !action ||
        !action.payload ||
        !action.payload.submissions ||
        !action.payload.submissions.length
      ) {
        return state;
      }
      const {
        submissions,
        form: { _id: formId, sections },
      } = action.payload;
      return {
        ...state,
        [formId]: {
          ...submissions.reduce(
            (f, el, index) => ({
              ...f,
              [el._id]: new FormInstance({
                ...el,
                index, // To make sure formInstance order is not changed after update
                sections,
              }),
            }),
            {},
          ),
        },
      };
    }

    case types.SET_FORM_INSTANCE_ACCEPTANCE_STATUS_SUCCESS:
    case types.SET_SCHEDULING_PROGRESS_SUCCESS: {
      if (!action || !action.payload || !action.payload.formInstance)
        return state;
      const { formInstance } = action.payload;
      return {
        ...state,
        [formInstance.formId]: {
          ...state[formInstance.formId],
          [formInstance._id]: {
            ...state[formInstance.formId][formInstance._id],
            ...formInstance,
          },
        },
      };
    }

    case types.ASSIGN_USER_TO_FORM_INSTANCE_SUCCESS: {
      const {
        payload: { formInstance },
      } = action;
      const updatedTECoreProps = new FormInstanceTECoreProps(
        formInstance.teCoreProps,
      );
      return {
        ...state,
        [formInstance.formId]: {
          ...state[formInstance.formId],
          [formInstance._id]: {
            ...state[formInstance.formId][formInstance._id],
            teCoreProps: updatedTECoreProps,
          },
        },
      };
    }

    case types.UPDATE_SELECTION_SETTINGS_SUCCESS: {
      const {
        actionMeta: { formId, formInstanceId },
        formInstance: { teCoreProps },
      } = action.payload;

      const updatedTECoreProps = new FormInstanceTECoreProps(teCoreProps);

      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: {
            ...state[formId][formInstanceId],
            teCoreProps: updatedTECoreProps,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
