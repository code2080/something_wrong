/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';
import { elementTypeMapping } from '../Constants/elementTypes.constants';
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
  GET_OBJECTS_BY_EXTID: 'getObjectsByExtid',
  GET_EXTID_PROPS: 'getExtIdProps',
  GET_CURRENT_USER: 'getCurrentUser',
  GET_RESERVATION_TEMPLATES: 'getReservationTemplates', // DEPRECATED
  GET_SELECTED_RESERVATION_TEMPLATE: 'getSelectedReservationTemplate', // DEPRECATED
  SELECT_RESERVATION: 'selectReservation',
  STOP_SCHEDULING: 'stopScheduling',
  DELETE_RESERVATIONS: 'deleteReservations',
  POPULATE_SELECTION: 'populateSelection', // DEPRECATED, use requestManuallyScheduleActivity
  GET_RESERVATION_TYPES: 'getReservationTypes',
  GET_RESERVATION_FIELDS: 'getReservationFields',
  REQUEST_GET_OBJECT_FROM_FILTER: 'requestGetObjectFromFilter',
  REQUEST_GET_FILTER_FROM_FILTER: 'requestGetFilterFromFilter',
  REQUEST_REPLACE_OBJECT: 'requestReplaceObject',
  REQUEST_SCHEDULE_ACTIVITY: 'requestScheduleActivity', // DEPRECATED, use requestScheduleActivity(...[activity]...)
  REQUEST_SCHEDULE_ACTIVITIES: 'requestScheduleActivities',
  REQUEST_HANDLE_OBJECT_REQUEST: 'requestHandleObjectRequest',
  SET_FORM_TYPE: 'setFormType',
  SET_RESERVATION_MODE: 'setReservationMode',
  VALIDATE_RESERVATIONS: 'validateReservations',
  GET_FIELDIDS_FOR_TYPES: 'getFieldIds',
  REQUEST_MANUALLY_SCHEDULE_ACTIVITY: 'requestManuallyScheduleActivity',
  GET_RELATED_GROUPS: 'getRelatedGroups',
  GET_ALLOCATION_TYPES: 'getAllocationTypes',
  REQUEST_CREATE_OBJECTS: 'requestCreateObjects',
};

export const teCoreActions = {
  SELECT_OBJECT: {
    callname: teCoreCallnames.SELECT_OBJECT,
    label: 'Select object',
    compatibleWith: [elementTypeMapping.ELEMENT_TYPE_DATASOURCE.elementId],
  },
  SELECT_OBJECTS: {
    callname: teCoreCallnames.SELECT_OBJECT,
    label: 'Select all objects',
    compatibleWith: [elementTypeMapping.ELEMENT_TYPE_DATASOURCE.elementId],
  },
  SELECT_TYPE: {
    callname: teCoreCallnames.SELECT_TYPE,
    label: 'Select type',
    compatibleWith: [elementTypeMapping.ELEMENT_TYPE_DATASOURCE.elementId],
  },
  GET_OBJECTS_BY_EXTID: {
    callname: teCoreCallnames.GET_OBJECTS_BY_EXTID,
  },
  GET_CURRENT_USER: {
    callname: teCoreCallnames.GET_CURRENT_USER,
  },
  FILTER_OBJECTS: {
    callname: teCoreCallnames.FILTER_OBJECTS,
    label: 'Filter objects',
    compatibleWith: [
      elementTypeMapping.ELEMENT_TYPE_DATASOURCE.elementId,
      elementTypeMapping.ELEMENT_TYPE_INPUT_DATASOURCE.elementId,
      elementTypeMapping.ELEMENT_TYPE_INPUT_NUMBER_DATASOURCE.elementId,
    ],
  },
  GET_EXTID_PROPS: {
    callname: teCoreCallnames.GET_EXTID_PROPS,
    mockFunction: (payload) => {
      const examplePayload = {
        objects: [],
        types: [
          'equipment',
          'courseevt',
          'room',
          'person_staff',
          'activity_teach',
        ],
        fields: [],
      };
      const result = {
        objects: {},
        types: {
          equipment: {
            label: 'Appliance',
          },
          courseevt: {
            label: 'Course event',
          },
          room: {
            label: 'Room',
          },
          person_staff: {
            label: 'Teacher',
          },
          activity_teach: {
            label: 'Course activity',
          },
        },
        fields: {},
      };
      return result;
    },
  },
  GET_RESERVATION_TEMPLATES: {
    // DEPRECATED
    callname: teCoreCallnames.GET_RESERVATION_TEMPLATES,
    mockFunction: () => reservationTemplates,
  },
  GET_SELECTED_RESERVATION_TEMPLATE: {
    // DEPRECATED
    callname: teCoreCallnames.GET_SELECTED_RESERVATION_TEMPLATE,
    mockFunction: () => 'scheduling',
  },
  SELECT_RESERVATION: {
    callname: teCoreCallnames.SELECT_RESERVATION,
  },
  DELETE_RESERVATIONS: {
    callname: teCoreCallnames.DELETE_RESERVATIONS,
    mockFunction: ({ activities, callback: cbFn }) =>
      cbFn({
        activityIds: activities.map((activity) => activity.id),
        result: true,
      }),
  },
  SCHEDULE_ACTIVITY: {
    callname: teCoreCallnames.SCHEDULE_ACTIVITY,
  },
  POPULATE_SELECTION: {
    callname: teCoreCallnames.POPULATE_SELECTION,
    mockFunction: (selection) => {
      // selection = {
      //   typedObjects: [...],
      //   formType: form.formType,
      //   reservationMode: form.reservationMode,
      // };
      console.log('Should populate the selection list with');
      console.log(selection);
    },
  },
  GET_RESERVATION_TYPES: {
    callname: teCoreCallnames.GET_RESERVATION_TYPES,
    mockFunction: () => reservationTypes,
  },
  GET_RESERVATION_FIELDS: {
    callname: teCoreCallnames.GET_RESERVATION_FIELDS,
    mockFunction: () => reservationFields,
  },
  REQUEST_GET_OBJECT_FROM_FILTER: {
    callname: teCoreCallnames.REQUEST_GET_OBJECT_FROM_FILTER,
    mockFunction: ({ activityValue, activity, callback }) => {
      callback(coreObject);
    },
  },
  REQUEST_GET_FILTER_FROM_FILTER: {
    callname: teCoreCallnames.REQUEST_GET_FILTER_FROM_FILTER,
    mockFunction: ({ activityValue, activity, callback }) => {
      callback(coreFilter);
    },
  },
  REQUEST_REPLACE_OBJECT: {
    callname: teCoreCallnames.REQUEST_REPLACE_OBJECT,
    mockFunction: async ({ objectExtId, typeExtId, callback }) => {
      callback(coreObject);
    },
  },
  REQUEST_SCHEDULE_ACTIVITY: {
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITY,
    mockFunction: ({ reservation, callback }) =>
      callback(coreReservationResult),
  },
  REQUEST_SCHEDULE_ACTIVITIES: {
    callname: teCoreCallnames.REQUEST_SCHEDULE_ACTIVITIES,
    mockFunction: ({ reservations, formInfo, callback }) =>
      callback(
        reservations.map((r) => ({
          activityId: r.activityId,
          result: coreReservationResult,
          failedObject: {
            extId: 'course_activity_examination',
            id: 4583,
            type: {
              class: 'typename',
              description: 'Samlingsbegrepp för olika sorters aktiviteter',
              extid: 'activity',
              id: 8,
              name: 'Activity',
            },
            typeExtId: 'activity',
          }, // Will be present if an invalid object combination was created - this is the object which couldn´t be added
        })),
      ),
  },
  REQUEST_HANDLE_OBJECT_REQUEST: {
    callname: teCoreCallnames.REQUEST_HANDLE_OBJECT_REQUEST,
    mockFunction: ({ extId, fields, objectType, requestType, callback }) => {
      console.log(`Asking core to handle request of type ${requestType}`);
      callback({
        extId: 'fakeReplacementExtId',
        fields: [{ values: ['fakeLabel'] }],
      });
    },
  },
  SET_TOOLBAR_CONTENT: {
    callname: teCoreCallnames.SET_TOOLBAR_CONTENT,
  },
  SET_FORM_TYPE: {
    callname: teCoreCallnames.SET_FORM_TYPE,
    mockFunction: ({ formType }) => {
      // Setting correct function in core
    },
  },
  SET_RESERVATION_MODE: {
    callname: teCoreCallnames.SET_RESERVATION_MODE,
    mockFunction: ({ mode, callback }) => {
      console.log(`Setting reservation mode: ${mode}`);
      callback({ res: 'SUCCESS' });
    },
  },
  VALIDATE_RESERVATIONS: {
    callname: teCoreCallnames.VALIDATE_RESERVATIONS,
    mockFunction: ({ reservationIds, callback }) => {
      console.log('No validation on mock');
      callback({ res: { invalidReservations: [] } });
    },
  },
  GET_FIELDIDS_FOR_TYPES: {
    callname: teCoreCallnames.GET_FIELDIDS_FOR_TYPES,
    mockFunction: ({ typeExtIds, callback }) => {
      if (_.isEmpty(typeExtIds)) return null;
      const res = typeExtIds.reduce(
        (labels, extId) => ({
          ...labels,
          extId: {
            [`${extId}-fieldId`]: `${extId}-fieldLabel`,
            [`${extId}-field2Id`]: `${extId}-field2Label`,
          },
        }),
        {},
      );
      callback(res);
    },
  },
  REQUEST_MANUALLY_SCHEDULE_ACTIVITY: {
    callname: teCoreCallnames.REQUEST_MANUALLY_SCHEDULE_ACTIVITY,
    mockFunction: (_payload, callback) => {
      callback(['testReservationId']);
    },
  },
  GET_RELATED_GROUPS: {
    callname: teCoreCallnames.GET_RELATED_GROUPS,
    mockFunction: ({ objectExtIds, typeExtId, callback }) => {
      const mockResult = {};
      (objectExtIds || []).forEach((oId) => {
        mockResult[oId] = ['teacher_hare', 'teacher_grubbe'];
      });
      if (typeof callback === 'function') {
        callback(mockResult);
      }
    },
  },
  GET_ALLOCATION_TYPES: {
    callname: teCoreCallnames.GET_ALLOCATION_TYPES,
    mockFunction: () => reservationTypes,
  },
  REQUEST_CREATE_OBJECTS: {
    callname: teCoreCallnames.REQUEST_CREATE_OBJECTS,
    mockFunction: () => console.log('MOCKED: Create object request'),
  }
};
