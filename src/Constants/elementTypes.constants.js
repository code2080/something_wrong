import { valueTypes } from './valueTypes.constants';

// TYPE DECLARATIONS
export const elementTypes = {
  ELEMENT_TYPE_INPUT_TEXT: 'ELEMENT_TYPE_INPUT_TEXT',
  ELEMENT_TYPE_INPUT_NUMBER: 'ELEMENT_TYPE_INPUT_NUMBER',
  ELEMENT_TYPE_INPUT_TIME: 'ELEMENT_TYPE_INPUT_TIME',
  ELEMENT_TYPE_INPUT_DATE: 'ELEMENT_TYPE_INPUT_DATE',
  ELEMENT_TYPE_INPUT_DATE_RANGE: 'ELEMENT_TYPE_INPUT_DATE_RANGE',
  ELEMENT_TYPE_RADIO_GROUP: 'ELEMENT_TYPE_RADIO_GROUP',
  ELEMENT_TYPE_DROPDOWN: 'ELEMENT_TYPE_DROPDOWN',
  ELEMENT_TYPE_CHECKBOX_GROUP: 'ELEMENT_TYPE_CHECKBOX_GROUP',
  ELEMENT_TYPE_CHECKBOX: 'ELEMENT_TYPE_CHECKBOX',
  ELEMENT_TYPE_TEXTAREA: 'ELEMENT_TYPE_TEXTAREA',
  ELEMENT_TYPE_PLAINTEXT: 'ELEMENT_TYPE_PLAINTEXT',
  ELEMENT_TYPE_CALENDAR: 'ELEMENT_TYPE_CALENDAR',
  ELEMENT_TYPE_UUID: 'ELEMENT_TYPE_UUID',
  ELEMENT_TYPE_EVENT_CALENDAR: 'ELEMENT_TYPE_EVENT_CALENDAR',
  ELEMENT_TYPE_DATASOURCE: 'ELEMENT_TYPE_DATASOURCE',
  ELEMENT_TYPE_INPUT_DATASOURCE: 'ELEMENT_TYPE_INPUT_DATASOURCE',
  ELEMENT_TYPE_INPUT_NUMBER_DATASOURCE: 'ELEMENT_TYPE_INPUT_NUMBER_DATASOURCE',
  ELEMENT_TYPE_DURATION: 'ELEMENT_TYPE_DURATION',
  ELEMENT_TYPE_DAY_PICKER: 'ELEMENT_TYPE_DAY_PICKER',
  ELEMENT_TYPE_WEEK_PICKER: 'ELEMENT_TYPE_WEEK_PICKER',
  ELEMENT_TYPE_PADDING: 'ELEMENT_TYPE_PADDING',
};

// TYPE DEFINITIONS
export const elementTypeMapping = {
  ELEMENT_TYPE_INPUT_TEXT: {
    label: 'Text input',
    valueType: valueTypes.SINGLE,
    elementId: '5c3248b3e3ae55831d79a276',
  },
  ELEMENT_TYPE_INPUT_NUMBER: {
    label: 'Number input',
    valueType: valueTypes.SINGLE,
    elementId: '5c3248b3e3ae55831d79a277',
  },
  ELEMENT_TYPE_INPUT_TIME: {
    label: 'Time picker',
    valueType: valueTypes.SINGLE,
    elementId: '5c3248b3e3ae55831d79a278',
  },
  ELEMENT_TYPE_INPUT_DATE: {
    label: 'Date picker',
    valueType: valueTypes.SINGLE,
    elementId: '5c3248b3e3ae55831d79a279',
  },
  ELEMENT_TYPE_INPUT_DATE_RANGE: {
    label: 'Date range picker',
    valueType: valueTypes.ARRAY,
    elementId: '5c3248b3e3ae55831d79a27a',
  },
  ELEMENT_TYPE_DROPDOWN: {
    label: 'Dropdown',
    valueType: valueTypes.ARRAY,
    elementId: '5c3248b3e3ae55831d79a27b',
  },
  ELEMENT_TYPE_RADIO_GROUP: {
    label: 'Radio group',
    valueType: valueTypes.SINGLE,
    elementId: '5c3248b3e3ae55831d79a27c',
  },
  ELEMENT_TYPE_CHECKBOX_GROUP: {
    label: 'Checkbox group',
    valueType: valueTypes.ARRAY,
    elementId: '5c59a0fe1a47001ad08cf1d5',
  },
  ELEMENT_TYPE_CHECKBOX: {
    label: 'Checkbox',
    valueType: valueTypes.SINGLE,
    elementId: '5c3248b3e3ae55831d79a27d',
  },
  ELEMENT_TYPE_TEXTAREA: {
    label: 'Textarea',
    valueType: valueTypes.SINGLE,
    elementId: '5c3248b3e3ae55831d79a27e',
  },
  ELEMENT_TYPE_PLAINTEXT: {
    label: 'Static text',
    valueType: valueTypes.SINGLE,
    elementId: '5c3248b3e3ae55831d79a27f',
    isStatic: true,
  },
  ELEMENT_TYPE_CALENDAR: {
    label: 'Calendar',
    valueType: valueTypes.OBJECT,
    elementId: '5c49b83aa44357952fda8486',
  },
  ELEMENT_TYPE_UUID: {
    label: 'UUID',
    valueType: valueTypes.SINGLE,
    elementId: '5c62e9c514f41845fa3699f2',
  },
  ELEMENT_TYPE_EVENT_CALENDAR: {
    label: 'Event calendar',
    valueType: valueTypes.ARRAY,
    elementId: '5d791cf202ede70224f59810',
  },
  ELEMENT_TYPE_DATASOURCE: {
    label: 'Datasource',
    valueType: valueTypes.ARRAY,
    elementId: '5d8331e47cd014cfb7e15394',
  },
  ELEMENT_TYPE_INPUT_DATASOURCE: {
    label: 'Field search (text)',
    valueType: valueTypes.OBJECT,
    elementId: '5e4f39674012050020028bcc',
  },
  ELEMENT_TYPE_INPUT_NUMBER_DATASOURCE: {
    label: 'Field search (number)',
    valueType: valueTypes.OBJECT,
    elementId: '5e4f39674012050020028bcb',
  },
  ELEMENT_TYPE_DURATION: {
    label: 'Duration',
    valueType: valueTypes.SINGLE,
    elementId: '5ef38b9915047a5cc681a7fa',
  },
  ELEMENT_TYPE_DAY_PICKER: {
    label: 'Day picker',
    valueType: valueTypes.SINGLE,
    elementId: '5ff04b6301a271136b76b60b',
  },
  ELEMENT_TYPE_WEEK_PICKER: {
    label: 'Week picker',
    valueType: valueTypes.SINGLE,
    elementId: '5ff286d801a271136b76b60c',
  },
  ELEMENT_TYPE_PADDING: {
    label: 'Padding',
    valueType: valueTypes.SINGLE,
    elementId: '5ff3fdb82251fc05196c59d2',
  },
};

export const WEEKDAYNAMES = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  SUN: 'Sunday',
};
