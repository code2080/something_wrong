import { valueTypes } from './valueTypes.constants';

// TYPE DECLARATIONS
export const elementTypes = {
  INPUT_TEXT: 'ELEMENT_TYPE_INPUT_TEXT',
  INPUT_NUMBER: 'ELEMENT_TYPE_INPUT_NUMBER',
  INPUT_TIME: 'ELEMENT_TYPE_INPUT_TIME',
  INPUT_DATE: 'ELEMENT_TYPE_INPUT_DATE',
  INPUT_DATE_RANGE: 'ELEMENT_TYPE_INPUT_DATE_RANGE',
  RADIO_GROUP: 'ELEMENT_TYPE_RADIO_GROUP',
  DROPDOWN: 'ELEMENT_TYPE_DROPDOWN',
  CHECKBOX_GROUP: 'ELEMENT_TYPE_CHECKBOX_GROUP',
  CHECKBOX: 'ELEMENT_TYPE_CHECKBOX',
  TEXTAREA: 'ELEMENT_TYPE_TEXTAREA',
  PLAINTEXT: 'ELEMENT_TYPE_PLAINTEXT',
  CALENDAR: 'ELEMENT_TYPE_CALENDAR',
  UUID: 'ELEMENT_TYPE_UUID',
  EVENT_CALENDAR: 'ELEMENT_TYPE_EVENT_CALENDAR',
  DATASOURCE: 'ELEMENT_TYPE_DATASOURCE',
  INPUT_DATASOURCE: 'ELEMENT_TYPE_INPUT_DATASOURCE',
  INPUT_NUMBER_DATASOURCE: 'ELEMENT_TYPE_INPUT_NUMBER_DATASOURCE',
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
    elementId: '5dbadccf1c9d4400002c7884',
  },
  ELEMENT_TYPE_INPUT_NUMBER_DATASOURCE: {
    label: 'Field search (number)',
    valueType: valueTypes.OBJECT,
    elementId: '5dbadde11c9d4400002c7886',
  },
};
