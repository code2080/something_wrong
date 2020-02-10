import { reservationTemplates } from '../Mock/ReservationTemplates';

export const teCoreActions = {
  SELECT_OBJECT: {
    callname: 'selectObject',
    label: 'Select object',
    compatibleWith: ['5d8331e47cd014cfb7e15394'],
  },
  SELECT_TYPE: {
    callname: 'selectType',
    label: 'Select type',
    compatibleWith: ['5d8331e47cd014cfb7e15394'],
  },
  FILTER_OBJECTS: {
    callname: 'filterObjects',
    label: 'Filter objects',
    compatibleWith: ['5dbadccf1c9d4400002c7884', '5dbadde11c9d4400002c7886'],
  },
  GET_EXTID_PROPS: {
    callname: 'getExtIdProps',
  },
  GET_RESERVATION_TEMPLATES: {
    callname: 'getReservationTemplates',
    mockFunction: () => reservationTemplates,
  },
  GET_SELECTED_RESERVATION_TEMPLATE: {
    callname: 'getSelectedReservationTemplate',
    mockFunction: () => 'scheduling',
  },
  SELECT_RESERVATION: {
    callname: 'selectReservation',
  },
  DELETE_RESERVATION: {
    callname: 'deleteReservation',
  },
  SCHEDULE_RESERVATION: {
    callname: 'scheduleReservation',
  },
};
