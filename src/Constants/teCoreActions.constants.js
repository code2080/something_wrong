import { reservationTemplates } from "../Mock/ReservationTemplates";
import { reservationTypes } from "../Mock/ReservationTypes";
import { reservaionFields } from "../Mock/ReservaionFields";

export const teCoreCallnames = {
  SELECT_OBJECT: "selectObject",
  SELECT_TYPE: "selectType",
  FILTER_OBJECTS: "filterObjects",
  GET_EXTID_PROPS: "getExtIdProps",
  GET_RESERVATION_TEMPLATES: "getReservationTemplates",
  GET_SELECTED_RESERVATION_TEMPLATE: "getSelectedReservationTemplate",
  SELECT_RESERVATION: "selectReservation",
  DELETE_RESERVATION: "deleteReservation",
  SCHEDULE_RESERVATION: "scheduleReservation",
  GET_RESERVATION_TYPES: "getReservationTypes",
  GET_RESERVATION_FIELDS: "getReservationFields"
};

export const teCoreActions = {
  SELECT_OBJECT: {
    callname: teCoreCallnames.SELECT_OBJECT,
    label: "Select object",
    compatibleWith: ["5d8331e47cd014cfb7e15394"]
  },
  SELECT_TYPE: {
    callname: teCoreCallnames.SELECT_TYPE,
    label: "Select type",
    compatibleWith: ["5d8331e47cd014cfb7e15394"]
  },
  FILTER_OBJECTS: {
    callname: teCoreCallnames.FILTER_OBJECTS,
    label: "Filter objects",
    compatibleWith: [
      "5d8331e47cd014cfb7e15394",
      "5dbadccf1c9d4400002c7884",
      "5dbadde11c9d4400002c7886"
    ]
  },
  GET_EXTID_PROPS: {
    callname: teCoreCallnames.GET_EXTID_PROPS
  },
  GET_RESERVATION_TEMPLATES: {
    callname: teCoreCallnames.GET_EXTID_PROPS,
    mockFunction: () => reservationTemplates
  },
  GET_SELECTED_RESERVATION_TEMPLATE: {
    callname: teCoreCallnames.GET_SELECTED_RESERVATION_TEMPLATE,
    mockFunction: () => "scheduling"
  },
  SELECT_RESERVATION: {
    callname: teCoreCallnames.SELECT_RESERVATION
  },
  DELETE_RESERVATION: {
    callname: teCoreCallnames.DELETE_RESERVATION
  },
  SCHEDULE_RESERVATION: {
    callname: teCoreCallnames.SCHEDULE_RESERVATION
  },
  GET_RESERVATION_TYPES: {
    callname: teCoreCallnames.GET_RESERVATION_TYPES,
    mockFunction: () => reservationTypes
  },
  GET_RESERVATION_FIELDS: {
    callname: teCoreCallnames.GET_RESERVATION_FIELDS
    mockFunction: () => reservaionFields
  }
};
