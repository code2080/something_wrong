import { reservationTemplates } from '../Mock/ReservationTemplates';
import { reservationTypes } from '../Mock/ReservationTypes';
import { reservationFields } from '../Mock/ReservationFields';
import { coreObject } from '../Mock/CoreObject';
import { coreFilter } from '../Mock/CoreFilter';
import { coreReservationResult } from '../Mock/CoreReservationResult';

export const teCoreCallnames = {
  SET_TOOLBAR_CONTENT: 'setToolbarContent',
  SELECT_OBJECT: 'selectObject',
  SELECT_TYPE: 'selectType',
  FILTER_OBJECTS: 'filterObjects',
  GET_EXTID_PROPS: 'getExtIdProps',
  GET_RESERVATION_TEMPLATES: 'getReservationTemplates', // DEPRECATED
  GET_SELECTED_RESERVATION_TEMPLATE: 'getSelectedReservationTemplate', // DEPRECATED
  SELECT_RESERVATION: 'selectReservation',
  DELETE_RESERVATION: 'deleteReservation',
  POPULATE_SELECTION: 'populateSelection', // WHERE IS THIS ONE USED?
  GET_RESERVATION_TYPES: 'getReservationTypes',
  GET_RESERVATION_FIELDS: 'getReservationFields',
  REQUEST_GET_OBJECT_FROM_FILTER: 'requestGetObjectFromFilter',
  REQUEST_GET_FILTER_FROM_FILTER: 'requestGetFilterFromFilter',
  REQUEST_REPLACE_OBJECT: 'requestReplaceObject',
  REQUEST_SCHEDULE_ACTIVITY: 'requestScheduleActivity',
  REQUEST_SCHEDULE_ACTIVITIES: 'requestScheduleActivities'
};

export const teCoreActions = {
  SELECT_OBJECT: {
    callname: teCoreCallnames.SELECT_OBJECT,
    label: 'Select object',
    compatibleWith: ['5d8331e47cd014cfb7e15394']
  },
  SELECT_TYPE: {
    callname: teCoreCallnames.SELECT_TYPE,
    label: 'Select type',
    compatibleWith: ['5d8331e47cd014cfb7e15394']
  },
  FILTER_OBJECTS: {
    callname: teCoreCallnames.FILTER_OBJECTS,
    label: 'Filter objects',
    compatibleWith: [
      '5d8331e47cd014cfb7e15394',
      '5dbadccf1c9d4400002c7884',
      '5dbadde11c9d4400002c7886'
    ]
  },
  GET_EXTID_PROPS: {
    callname: teCoreCallnames.GET_EXTID_PROPS
  },
  GET_RESERVATION_TEMPLATES: {
    // DEPRECATED
    callname: teCoreCallnames.GET_EXTID_PROPS,
    mockFunction: () => reservationTemplates
  },
  GET_SELECTED_RESERVATION_TEMPLATE: {
    // DEPRECATED
    callname: teCoreCallnames.GET_SELECTED_RESERVATION_TEMPLATE,
    mockFunction: () => 'scheduling'
  },
  SELECT_RESERVATION: {
    callname: teCoreCallnames.SELECT_RESERVATION
  },
  DELETE_RESERVATION: {
    callname: teCoreCallnames.DELETE_RESERVATION,
    mock: ({ activity, callback: cbFn }) => cbFn({ activityId: activity._id, result: true })
  },
  SCHEDULE_ACTIVITY: {
    callname: teCoreCallnames.SCHEDULE_ACTIVITY
  },
  POPULATE_SELECTION: {
    callname: teCoreCallnames.POPULATE_SELECTION,
    mockFunction: selection => {
      console.log('Should populate the selection list with');
      console.log(selection);
    }
  },
  GET_RESERVATION_TYPES: {
    callname: teCoreCallnames.GET_RESERVATION_TYPES,
    mockFunction: () => reservationTypes
  },
  GET_RESERVATION_FIELDS: {
    callname: teCoreCallnames.GET_RESERVATION_FIELDS,
    mockFunction: () => reservationFields
  },
  REQUEST_GET_OBJECT_FROM_FILTER: {
    callname: teCoreCallnames.REQUEST_GET_OBJECT_FROM_FILTER,
    mockFunction: ({ activityValue, activity, callback }) => {
      callback(coreObject);
    }
  },
  REQUEST_GET_FILTER_FROM_FILTER: {
    callname: teCoreCallnames.REQUEST_GET_FILTER_FROM_FILTER,
    mockFunction: ({ activityValue, activity, callback }) => {
      callback(coreFilter);
    }
  },
  REQUEST_REPLACE_OBJECT: {
    callname: teCoreCallnames.REQUEST_REPLACE_OBJECT,
    mockFunction: ({ activityValue, activity, callback }) => {
      callback(coreObject);
    }
  },
  REQUEST_SCHEDULE_ACTIVITY: {
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITY,
    mockFunction: ({ reservation, callback }) => callback(coreReservationResult),
  },
  REQUEST_SCHEDULE_ACTIVITIES: {
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES,
    mockFunction: ({ reservations, callback }) =>
      callback(
        reservations.map((r, index) => ({
          activityId: r.activityId,
          result: { reference: 1000 + index }
        }))
      )
  },
  SET_TOOLBAR_CONTENT: {
    callname: teCoreCallnames.SET_TOOLBAR_CONTENT
  }
};
