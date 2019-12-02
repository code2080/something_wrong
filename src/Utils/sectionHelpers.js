import moment from 'moment';
import {
  SECTION_VERTICAL,
  SECTION_TABLE,
  SECTION_CONNECTED
} from '../Constants/sectionTypes.constants';

const connectedSectionColumns = [
  {
    title: 'Title',
    key: 'title',
    dataIndex: 'title',
    render: val => val || 'N/A',
  },
  {
    title: 'Start time',
    key: 'startTime',
    dataIndex: 'startTime',
    render: val => moment(val).format('YYYY-MM-DD'),
  },
  {
    title: 'End time',
    key: 'endTime',
    dataIndex: 'endTime',
    render: val => moment(val).format('YYYY-MM-DD'),
  }
];

/**
 * @function extractColumnsFromSection
 * @description transform the elements in a section into table columns
 * @param {Object} section the form section object to extract the columns from
 * @returns {Array} columns
 * @todo need to improve the render to render differently depending on element value type
 */
export const extractColumnsFromSection = (section, sectionType) => {
  const _elementColumns = section.elements.map(el => ({
    title: el.label,
    key: el._id,
    dataIndex: el._id,
    render: val => {
      if (val instanceof Object && val.value) {
        return val.value;
      }
      return val || 'N/A'},
  }));

  switch (sectionType) {
    case SECTION_CONNECTED:
      return [ ...connectedSectionColumns, ..._elementColumns ];

    default:
      return [ ..._elementColumns ];
  };
};

/**
 * @function extractVerticalSectionDataFromValues
 * @description extracts table data for arbtriray columns in a vertical section
 * @param {Array} values the values to extract the data from
 * @param {Array} columns the columns to use as transformation map
 */
const extractVerticalSectionDataFromValues = (values, columns, sectionId) => {
  const _data = columns.reduce((data, col) => {
    if (!values || !columns || !sectionId || !values.length || !columns.length) return data;
    // Find the element idx
    const elementIdx = values.findIndex(el => el.elementId === col.dataIndex);
    if (elementIdx === -1) return data;
    return { ...data, [col.dataIndex]: values[elementIdx].value };
  }, {});
  return [ { ..._data, rowKey: sectionId } ];
};

const extractConnectedSectionDataFromValues = (values, columns) => {
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

const extractTableSectionDataFromValues = (values, columns) => {
  if (!values || !columns || Object.keys(values).length === 0 || !columns.length) return [];
  console.log(values, columns);
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
 * @function extractColumnDataFromValues
 * @description returns the equivalent table data source array for an arbitrary set of columns
 * @param {Array || Object} values the values object to transform the data from
 * @param {Array} columns the columns to base the transformation on
 * @param {String} sectionId the id of the section
 * @param {String} sectionType the type of section
 */
export const extractColumnDataFromValues = (values, columns, sectionId, sectionType) => {
  switch (sectionType) {
    case SECTION_VERTICAL:
      return extractVerticalSectionDataFromValues(values, columns, sectionId);
    case SECTION_TABLE:
      return extractTableSectionDataFromValues(values, columns);
    case SECTION_CONNECTED:
      return extractConnectedSectionDataFromValues(values, columns);
    default:
      return [];
  }
};
