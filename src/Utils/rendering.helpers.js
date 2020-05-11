import React from 'react';
import moment from 'moment';

// HELPERS
import { getElementTypeFromId } from './elements.helpers';

// COMPONENTS
import Datasource from '../Components/Elements/Datasource';
import TimePicker from '../Components/Elements/TimePicker';
import DatePicker from '../Components/Elements/DatePicker';
import DateRangePicker from '../Components/Elements/DateRangePicker';
import Checkbox from '../Components/Elements/Checkbox';
import OptionSelection from '../Components/Elements/OptionSelection';
import TimeSlotColumn from '../Components/Elements/TimeSlotColumn';
import FreeTextFilter from '../Components/Elements/FreeTextFilter';
import NumberFilter from '../Components/Elements/NumberFilter';
import ManualSchedulingColumn from '../Components/TableColumns/Components/ManualSchedulingColumn/ManualSchedulingColumn';
import EllipsisRenderer from '../Components/TableColumns/Components/EllipsisRenderer';

// CONSTANTS
import { elementTypes } from '../Constants/elementTypes.constants';
import {
  SECTION_VERTICAL,
  SECTION_TABLE,
  SECTION_CONNECTED
} from '../Constants/sectionTypes.constants';

const connectedSectionColumns = {
  NO_TIMESLOTS: [
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
      render: val => <EllipsisRenderer text={val || 'N/A'} width={100} />,
    },
    {
      title: 'Start time',
      key: 'startTime',
      dataIndex: 'startTime',
      render: val => <EllipsisRenderer text={moment(val).format('YYYY-MM-DD HH:mm')} width={100} />,
    },
    {
      title: 'End time',
      key: 'endTime',
      dataIndex: 'endTime',
      render: val => <EllipsisRenderer text={moment(val).format('YYYY-MM-DD HH:mm')} width={100} />,
    },
  ],
  WITH_TIMESLOTS: timeslots => [
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
      render: val => val || 'N/A',
    },
    {
      title: 'Timeslot',
      key: 'timeslot',
      dataIndex: null,
      render: (_, event) => <TimeSlotColumn event={event} timeslots={timeslots} />,
    },
  ],
  SCHEDULING: (sectionId, formInstanceId, formId) => [
    {
      title: 'Scheduling',
      key: 'scheduling',
      dataIndex: null,
      render: (_, event) => (
        <ManualSchedulingColumn
          event={event}
          sectionId={sectionId}
          formInstanceId={formInstanceId}
          formId={formId}
        />
      ),
    },
  ],
};

/**
 * @function renderElementValue
 * @description determines the appropriate renderer for a value based on element type
 * @param {Any} value the value in question
 * @param {Object} element the element in question
 * @returns {ReactNode} rendered react node
 */
export const renderElementValue = (value, element) => {
  if (value == null) return 'N/A';
  const elementType = getElementTypeFromId(element.elementId);
  if (!elementType || !elementTypes[elementType]) return value.toString();

  switch (elementType) {
    case elementTypes.ELEMENT_TYPE_INPUT_TIME:
      return <TimePicker value={value} />;
    case elementTypes.ELEMENT_TYPE_INPUT_DATE:
      return <DatePicker value={value} />;
    case elementTypes.ELEMENT_TYPE_INPUT_DATE_RANGE:
      return <DateRangePicker value={value} />;
    case elementTypes.ELEMENT_TYPE_RADIO_GROUP:
      return <OptionSelection value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_DROPDOWN:
      return <OptionSelection value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_CHECKBOX:
      return <Checkbox value={value} />
    case elementTypes.ELEMENT_TYPE_CHECKBOX_GROUP:
      return <OptionSelection value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_PLAINTEXT:
      /**
       * @todo this should probably not be rendered at all (even as a column?) since it's not something the user's put in
       */
      return value.toString();
    case elementTypes.ELEMENT_TYPE_CALENDAR:
      /**
       * @todo break into separate component
       */
      return value.toString();
    case elementTypes.ELEMENT_TYPE_DATASOURCE:
      return <Datasource value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_INPUT_DATASOURCE:
      return <FreeTextFilter value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_INPUT_NUMBER_DATASOURCE:
      return <NumberFilter value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_UUID:
    case elementTypes.ELEMENT_TYPE_TEXTAREA:
    case elementTypes.ELEMENT_TYPE_INPUT_TEXT:
    case elementTypes.ELEMENT_TYPE_INPUT_NUMBER:
    default:
      return value.toString();
  }
};

/**
 * @function transformSectionToTableColumns
 * @description transform the various elements in a section into table columns
 * @param {Object} section the form section object to extract the columns from
 * @returns {Array} columns
 */
export const transformSectionToTableColumns = (section, sectionType, formInstanceId, formId) => {
  const _elementColumns = section.elements.map(el => ({
    title: el.label,
    key: el._id,
    dataIndex: el._id,
    render: value => renderElementValue(value, el),
  }));

  switch (sectionType) {
    case SECTION_CONNECTED: {
      if (section.calendarSettings && section.calendarSettings.useTimeslots) {
        return [
          ...connectedSectionColumns.SCHEDULING(section._id, formInstanceId, formId),
          ...connectedSectionColumns.WITH_TIMESLOTS(section.calendarSettings.timeslots),
          ..._elementColumns,
        ];
      }
      return [
        ...connectedSectionColumns.SCHEDULING(section._id, formInstanceId, formId),
        ...connectedSectionColumns.NO_TIMESLOTS,
        ..._elementColumns,
      ];
    }

    case SECTION_TABLE:
      return [
        ...connectedSectionColumns.SCHEDULING(section._id, formInstanceId, formId),
        ..._elementColumns
      ];

    default:
      return [ ..._elementColumns ];
  };
};

/**
 * @function transformVerticalSectionValuesToTableRows
 * @description takes section values from a vertical section, and maps them to each respective column
 * @param {Array} values the vertical section values to extract the data from
 * @param {Array} columns the columns to use as transformation map
 */
const transformVerticalSectionValuesToTableRows = (values, columns, sectionId) => {
  const _data = columns.reduce((data, col) => {
    if (!values || !columns || !sectionId || !values.length || !columns.length) return data;
    // Find the element idx
    const elementIdx = values.findIndex(el => el.elementId === col.dataIndex);
    if (elementIdx === -1) return data;
    return { ...data, [col.dataIndex]: values[elementIdx].value };
  }, {});
  return [ { ..._data, rowKey: sectionId } ];
};

/**
 * @function transformConnectedSectionValuesToTableRows
 * @description takes section values from a connected section, and maps them to each respective column
 * @param {Array} values the vertical section values to extract the data from
 * @param {Array} columns the columns to use as transformation map
 */
const transformConnectedSectionValuesToTableRows = (values, columns) => {
  if (!values || !columns || Object.keys(values).length === 0 || !columns.length) return [];

  const _data = (Object.keys(values) || []).map(eventId => {
    const _eventValues = columns.reduce((eventValues, col) => {
      // Find the element index
      const elementIdx = values[eventId].values.findIndex(el => el.elementId === col.dataIndex);
      if (elementIdx === -1) return eventValues;
      return { ...eventValues, [col.dataIndex]: values[eventId].values[elementIdx].value };
    }, {});
    return {
      ..._eventValues,
      startTime: values[eventId].startTime,
      endTime: values[eventId].endTime,
      title: values[eventId].title,
      rowKey: eventId,
    };
  });
  return _data;
};

/**
 * @function transformTableSectionValuesToTableRows
 * @description takes section values from a table section, and maps them to each respective column
 * @param {Array} values the vertical section values to extract the data from
 * @param {Array} columns the columns to use as transformation map
 */
const transformTableSectionValuesToTableRows = (values, columns) => {
  if (!values || !columns || Object.keys(values).length === 0 || !columns.length) return [];
  const _data = (Object.keys(values) || []).map(eventId => {
    const _eventValues = columns.reduce((eventValues, col) => {
      // Find the element index
      const elementIdx = values[eventId].findIndex(el => el.elementId === col.dataIndex);
      if (elementIdx === -1) return eventValues;
      return { ...eventValues, [col.dataIndex]: values[eventId][elementIdx].value };
    }, {});
    return {
      ..._eventValues,
      rowKey: eventId,
    };
  });
  return _data;
};

/**
 * @function transformSectionValuesToTableRows
 * @description takes section value from a section of any type, and maps the values to each respective column
 * @param {Array || Object} values the values object to transform the data from
 * @param {Array} columns the columns to base the transformation on
 * @param {String} sectionId the id of the section
 * @param {String} sectionType the type of section
 */
export const transformSectionValuesToTableRows = (values, columns, sectionId, sectionType) => {
  switch (sectionType) {
    case SECTION_VERTICAL:
      return transformVerticalSectionValuesToTableRows(values, columns, sectionId);
    case SECTION_TABLE:
      return transformTableSectionValuesToTableRows(values, columns);
    case SECTION_CONNECTED:
      return transformConnectedSectionValuesToTableRows(values, columns);
    default:
      return [];
  }
};
