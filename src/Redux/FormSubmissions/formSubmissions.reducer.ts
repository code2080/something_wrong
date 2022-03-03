import { keyBy } from 'lodash';
import FormInstance from '../../Models/FormInstance.model';
import FormInstanceTECoreProps from '../../Models/FormInstanceTECoreProps.model';
import * as types from './formSubmissions.actionTypes';

// INITIAL STATE
import initialState from './formSubmissions.initialState';

const generateSubmissionsMapping = (currentMap, submissions, sections) => {
  const formInstances = submissions.map(
    (submission, index) => new FormInstance({ ...submission, index, sections }),
  );
  return {
    ...currentMap,
    byId: {
      ...currentMap.byId,
      ...keyBy(formInstances, '_id'),
    },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_SUBMISSIONS_FOR_FORM_SUCCESS: {
      const {
        submissions,
        total,
        form: { _id: formId, sections },
      } = action.payload;

      return {
        ...state,
        [formId]: {
          list: submissions.map(({ _id }) => _id),
          mapped: generateSubmissionsMapping(
            state[formId]?.mapped ?? {},
            submissions,
            sections,
          ),
          total,
        },
      };
    }

    case types.SET_FORM_INSTANCE_ACCEPTANCE_STATUS_SUCCESS:
    case types.SET_SCHEDULING_PROGRESS_SUCCESS:
    case types.ASSIGN_USER_TO_FORM_INSTANCE_SUCCESS: {
      if (!action || !action.payload || !action.payload.formInstance)
        return state;
      const { formInstance } = action.payload;
      const updatedTECoreProps = new FormInstanceTECoreProps(
        formInstance.teCoreProps,
      );
      return {
        ...state,
        [formInstance.formId]: {
          ...state[formInstance.formId],
          mapped: {
            ...state[formInstance.formId].mapped,
            byId: {
              ...state[formInstance.formId].mapped.byId,
              [formInstance._id]: {
                ...state[formInstance.formId].mapped.byId[formInstance._id],
                teCoreProps: updatedTECoreProps,
              },
            },
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
