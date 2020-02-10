import * as types from './reservations.actionTypes';
import { Reservation } from '../../Models/Reservation.model';

// INITIAL STATE
import initialState from './reservations.initialState';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_RESERVATIONS_FOR_FORM_SUCCESS: {
      const { payload: { actionMeta: { formId } } } = action;
      const reservations = (action.payload.reservations || [])
        .map(el => new Reservation(el))
        .reduce(
          (_reservations, reservation) => ({
            ..._reservations,
            [reservation.formInstanceId]: [
              ...(_reservations[reservation.formInstanceId] || []),
              reservation
            ]
          }),
          {}
        );
      return {
        ...state,
        [formId]: reservations,
      };
    }

    case types.FETCH_RESERVATIONS_FOR_FORM_INSTANCE_SUCCESS: {
      const reservations = (action.payload.reservations || []).map(el => new Reservation(el));
      const { payload: { actionMeta: { formId, formInstanceId } } } = action;
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: [ ...reservations ],
        }
      };
    }

    case types.SAVE_RESERVATIONS_FOR_FORM_INSTANCE_SUCCESS: {
      const reservations = (action.payload.reservations || []).map(el => new Reservation(el));
      const { payload: { actionMeta: { formId, formInstanceId } } } = action;
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: [ ...reservations ],
        }
      };
    }

    case types.MANUALLY_OVERRIDE_RESERVATION_VALUE_SUCCESS:
    case types.REVERT_TO_SUBMISSION_VALUE_SUCCESS: {
      const { formId, formInstanceId, _id } = action.payload.reservation;
      if (!formId || !formInstanceId)
        return state;
      const reservationIdx = state[formId][formInstanceId].findIndex(el => el._id === _id);
      if (reservationIdx === -1) return state;
      const reservation = new Reservation(action.payload.reservation);
      return {
        ...state,
        [formId]: {
          ...state[formId],
          [formInstanceId]: [
            ...state[formId][formInstanceId].slice(0, reservationIdx),
            reservation,
            ...state[formId][formInstanceId].slice(reservationIdx + 1),
          ],
        },
      };
    }

    case types.DELETE_RESERVATIONS_FOR_FORM_SUCCESS: {
      const { payload: { actionMeta: { formId } } } = action;
      return {
        ...state,
        [formId]: {},
      };
    }

    default:
      return state;
  }
}

export default reducer;
