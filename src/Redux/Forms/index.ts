import { createSlice } from '@reduxjs/toolkit';
import api from '../../Services/api.service';

// ACTIONS
import {
  finishedLoadingFailure,
  finishedLoadingSuccess,
  beginLoading,
  commitAPIPayloadToState,
} from '../../Utils/sliceHelpers';

// TYPES
import { /* createFn, */ TForm } from 'Types/Form.type';
import { ISimpleAPIState, IState } from 'Types/State.type';
import { EExternalServices } from 'Types/externalServices.enum';
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';

export const initialState: ISimpleAPIState = {
  // API STATE
  loading: false,
  hasErrors: false,
  // DATA
  results: [],
  map: {},
};

// Slice
const slice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    defaultRequestHandler: (state) => {
      beginLoading(state);
    },
    defaultFailureHandler: (state) => {
      finishedLoadingFailure(state);
    },
    fetchFormsSuccess: (state, { payload }) => {
      commitAPIPayloadToState(payload, state, (val: any) => val as TForm);
      finishedLoadingSuccess(state);
    },
  },
});

export default slice.reducer;

// Selectors
export const formsSelector = (state: IState): TForm[] => state.forms.results;

export const formSelector =
  (id: string | null | undefined) =>
  (state: IState): TForm | undefined =>
    id ? state.forms.map[id] || undefined : undefined;
export const formsLoading = (state: IState): boolean => state.forms.loading;

export const selectSectionInForm =
  (formId: string, sectionId: string) => (state: IState) => {
    return (
      state.forms.map[formId]?.sections.find(
        (section: any) => section._id === sectionId,
      ) || undefined
    );
  };

export const selectTimeslotsForSectionInForm =
  (formId: string, sectionId: string) => (state: IState) => {
    const section =
      state.forms.map[formId]?.sections.find(
        (section: any) => section._id === sectionId,
      ) || undefined;
    return section?.calendarSettings?.timeslots || [];
  };

export const selectFormAllowedGroupings =
  (formId: string) =>
  (state: IState): Record<EActivityGroupings, boolean> => {
    const form: TForm | undefined = state.forms.map[formId];

    if (!form) {
      return {
        FLAT: false,
        WEEK_PATTERN: false,
        TAG: false,
      };
    }

    /**
     * This is a little bit hacky but 99% correct
     * In theory, what could happen is that one section has week pattern but was never mapped to anything
     * This is highly unlikely, but would in this case give a false positive
     * False negatives should be impossible using this approach
     *
     * - JH
     */
    const hasWeekPattern = form.sections.some(
      (section) =>
        section.activityTemplatesSettings?.duration &&
        section.activityTemplatesSettings?.datasource &&
        section.activityTemplatesSettings?.weekPicker,
    );

    return {
      FLAT: true,
      WEEK_PATTERN: hasWeekPattern,
      TAG: true,
    };
  };

// Actions
export const {
  defaultRequestHandler,
  defaultFailureHandler,
  fetchFormsSuccess,
} = slice.actions;

export const fetchForms = () => async (dispatch: any) => {
  try {
    dispatch(defaultRequestHandler());
    const result = await api.get({
      endpoint: `forms`,
      service: EExternalServices.PREFERENCES_BE,
    });
    const { forms, owners } = result.data; // @todo refactor and move this call to AM BE
    dispatch(fetchFormsSuccess({ results: forms }));
    /**
     * Side effect to set users based on all the form instance owners on the forms
     */
    dispatch({ type: 'FETCH_FORMS_SUCCESS', payload: { owners } });
  } catch (e) {
    dispatch(defaultFailureHandler());
  }
};
