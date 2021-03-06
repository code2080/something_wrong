import moment from 'moment';
import _ from 'lodash';
import styles from '../Styles/requestStyle.module.scss';

// HELPERS

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
import Padding from '../Components/Elements/Padding';
import SortableTableCell from '../Components/DynamicTable/SortableTableCell';
import DateTime from '../Components/Common/DateTime';

// CONSTANTS
import { elementTypes } from '../Constants/elementTypes.constants';
import {
  SECTION_VERTICAL,
  SECTION_TABLE,
  SECTION_CONNECTED,
  SECTION_AVAILABILITY,
} from '../Constants/sectionTypes.constants';
import { DATE_TIME_FORMAT, TIME_FORMAT } from '../Constants/common.constants';
import ObjectRequestDropdown from '../Components/Elements/DatasourceInner/ObjectRequestDropdown';
import { ObjectRequest } from '../Redux/ObjectRequests/ObjectRequests.types';
import { getLocalDate } from './moment.helpers';
import LabelRenderer from './LabelRenderer';
import { sortByElementHtml } from './sorting.helpers';
import { getElementTypeFromId } from './elements.helpers';

const unformattedValue = (value) => (
  <div
    style={{
      zIndex: 2,
      position: 'relative',
    }}
  >
    {value}
  </div>
);

const connectedSectionColumns = {
  TIMEINFO: [
    {
      title: 'Start',
      key: 'startTime',
      dataIndex: 'startTime',
      fixedWidth: 130,
      render: (val, item: any) => (
        <SortableTableCell className={`startTime_${item.rowKey}`}>
          <DateTime value={val} format={DATE_TIME_FORMAT} />
        </SortableTableCell>
      ),
      sorter: (a, b) => {
        return sortByElementHtml(
          `.startTime_${a.rowKey}`,
          `.startTime_${b.rowKey}`,
        );
      },
    },
    {
      title: 'End',
      key: 'endTime',
      dataIndex: 'endTime',
      fixedWidth: 80,
      render: (val, item: any) => (
        <SortableTableCell className={`endTime_${item.rowKey}`}>
          <DateTime value={val} format={TIME_FORMAT} />
        </SortableTableCell>
      ),
      sorter: (a, b) => {
        return sortByElementHtml(
          `.endTime_${a.rowKey}`,
          `.endTime_${b.rowKey}`,
        );
      },
    },
  ],

  TEMPLATES: (section, objectRequests: ObjectRequest[] = []) =>
    section?.datasource
      ? [
          {
            title: <LabelRenderer extId={section.datasource} type='types' />,
            key: section._id,
            dataIndex: 'templateVal',
            render: (templateValue) => {
              if (!templateValue) return null;
              const request = objectRequests.find(
                (request) => request._id === templateValue,
              );
              return request ? (
                <ObjectRequestDropdown request={request} key={request._id} />
              ) : (
                <LabelRenderer
                  extId={templateValue}
                  key={templateValue}
                  type='objects'
                />
              );
            },
          },
        ]
      : [],
  GROUPS: (section, objectRequests: ObjectRequest[] = []) => {
    return section?.datasource
      ? [
          {
            title: <LabelRenderer extId={section.datasource} type='types' />,
            key: section._id,
            dataIndex: 'groupVal',
            render: (groupValue) => {
              if (groupValue && !_.isEmpty(objectRequests))
                return (
                  <div className={`group-request ${styles.requestStyle}`}>
                    {groupValue &&
                      groupValue.map((groupVal) => {
                        const req = objectRequests.find(
                          (request) => request._id === groupVal,
                        );
                        return req ? (
                          <ObjectRequestDropdown request={req} key={req._id} />
                        ) : (
                          <LabelRenderer
                            extId={groupVal}
                            key={groupVal}
                            type='objects'
                          />
                        );
                      })}{' '}
                  </div>
                );
            },
          },
        ]
      : [];
  },

  TIMESLOT: (timeslots) => [
    {
      title: 'Timeslot',
      key: 'timeslot',
      dataIndex: null,
      render: (event, item: any) => (
        <SortableTableCell className={`timeslot_${item.rowKey}`}>
          <TimeSlotColumn event={event} timeslots={timeslots} />
        </SortableTableCell>
      ),
      sorter: (a, b) => {
        return sortByElementHtml(
          `.timeslot_${a.rowKey} .value--wrapper`,
          `.timeslot_${b.rowKey} .value--wrapper`,
        );
      },
    },
  ],

  SCHEDULING: (_sectionId, _formInstanceId, _formId) => [], // TODO: Reenable this after we've built support for new data format
  // [
  //   {
  //     title: '',
  //     key: 'scheduling',
  //     dataIndex: null,
  //     fixedWidth: 82,
  //     hideInList: true,
  //     render: (_, event) => (
  //       <SelectAllElementValuesColumn
  //         event={event}
  //         sectionId={sectionId}
  //         formInstanceId={formInstanceId}
  //         formId={formId}
  //       />
  //     ),
  //   },
  // ],
};

const invalidIndex = (index) => {
  return index === -1;
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
  if (!element) return value;
  const elementType = getElementTypeFromId(element.elementId);
  if (!elementType || !elementTypes[elementType]) return value.toString();
  switch (elementType) {
    case elementTypes.ELEMENT_TYPE_INPUT_TIME:
      return <TimePicker value={value} />;
    case elementTypes.ELEMENT_TYPE_INPUT_DATE:
      return <DatePicker value={getLocalDate(value)} />;
    case elementTypes.ELEMENT_TYPE_INPUT_DATE_RANGE:
      return <DateRangePicker value={value} />;
    case elementTypes.ELEMENT_TYPE_RADIO_GROUP:
      return <OptionSelection value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_DROPDOWN:
      return <OptionSelection value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_CHECKBOX:
      return <Checkbox value={value} />;
    case elementTypes.ELEMENT_TYPE_CHECKBOX_GROUP:
      return <OptionSelection value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_PLAINTEXT:
      /**
       * @todo this should probably not be rendered at all (even as a column?) since it's not something the user's put in
       */
      return unformattedValue(value.toString());
    case elementTypes.ELEMENT_TYPE_CALENDAR:
      /**
       * @todo break into separate component
       */
      return unformattedValue(value.toString());
    case elementTypes.ELEMENT_TYPE_DATASOURCE:
      return (
        <div className='preline'>
          <Datasource value={value} element={element} />
        </div>
      );
    case elementTypes.ELEMENT_TYPE_INPUT_DATASOURCE:
      return <FreeTextFilter value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_INPUT_NUMBER_DATASOURCE:
      return <NumberFilter value={value} element={element} />;
    case elementTypes.ELEMENT_TYPE_DURATION: {
      const duration = moment.duration(value, 'minutes');
      return unformattedValue(`${duration.hours()}h ${duration.minutes()}m`);
    }
    case elementTypes.ELEMENT_TYPE_TEXTAREA:
      return (
        <div className='preline'>{unformattedValue(value.toString())}</div>
      );
    case elementTypes.ELEMENT_TYPE_DAY_PICKER:
      return moment(value, 'ddd').format('dddd');

    case elementTypes.ELEMENT_TYPE_WEEK_PICKER:
      if (!value || !value.startTime) return null;
      return getLocalDate(value).format('[Week] W / gggg');

    case elementTypes.ELEMENT_TYPE_PADDING:
      return <Padding value={value} element={element} />;

    case elementTypes.ELEMENT_TYPE_UUID:
    case elementTypes.ELEMENT_TYPE_INPUT_TEXT:
    case elementTypes.ELEMENT_TYPE_INPUT_NUMBER:
    default:
      return unformattedValue(value.toString());
  }
};

const availabilityCalendarColumns = [
  {
    title: 'Start time',
    key: 'start',
    dataIndex: 'start',
    render: (start) => <DateTime value={start} format={DATE_TIME_FORMAT} />,
  },
  {
    title: 'End time',
    key: 'end',
    dataIndex: 'end',
    render: (end) => <DateTime value={end} format={DATE_TIME_FORMAT} />,
  },
  {
    title: 'Comment',
    key: 'comment',
    dataIndex: 'comment',
    render: (comment) => <span>{comment}</span>,
  },
];

/**
 * @function transformSectionToTableColumns
 * @description transform the various elements in a section into table columns
 * @param {Object} section the form section object to extract the columns from
 * @returns {Array} columns
 */
export const transformSectionToTableColumns = (
  section,
  sectionType,
  formInstanceId,
  formId,
  objectRequests,
) => {
  const _elementColumns = section.elements.reduce(
    (cols, el) =>
      getElementTypeFromId(el.elementId) === elementTypes.ELEMENT_TYPE_PLAINTEXT
        ? cols
        : [
            ...cols,
            {
              title: el.label,
              key: el._id,
              dataIndex: el._id,
              render: (value, item: any) => (
                <SortableTableCell
                  className={`element_${el._id}_${item.rowKey}`}
                >
                  {renderElementValue(value, el)}
                </SortableTableCell>
              ),
              sorter: (a, b) => {
                return sortByElementHtml(
                  `.element_${el._id}_${a.rowKey}`,
                  `.element_${el._id}_${b.rowKey}`,
                );
              },
            },
          ],
    [],
  );

  switch (sectionType) {
    case SECTION_CONNECTED: {
      if (section.calendarSettings && section.calendarSettings.useTimeslots) {
        return [
          ...connectedSectionColumns.SCHEDULING(
            section._id,
            formInstanceId,
            formId,
          ),
          ...connectedSectionColumns.TIMEINFO,
          ...connectedSectionColumns.TIMESLOT(
            section.calendarSettings.timeslots,
          ),
          ...connectedSectionColumns.TEMPLATES(
            section.activityTemplatesSettings,
            objectRequests,
          ),
          ...connectedSectionColumns.GROUPS(
            section.groupManagementSettings,
            objectRequests,
          ),
          ..._elementColumns,
        ];
      }

      return [
        ...connectedSectionColumns.SCHEDULING(
          section._id,
          formInstanceId,
          formId,
        ),
        ...connectedSectionColumns.TIMEINFO,
        ...connectedSectionColumns.TEMPLATES(
          section.activityTemplatesSettings,
          objectRequests,
        ),
        ...connectedSectionColumns.GROUPS(
          section.groupManagementSettings,
          objectRequests,
        ),
        ..._elementColumns,
      ];
    }

    case SECTION_TABLE:
      return [
        ...connectedSectionColumns.SCHEDULING(
          section._id,
          formInstanceId,
          formId,
        ),
        ...connectedSectionColumns.TEMPLATES(
          section.activityTemplatesSettings,
          objectRequests,
        ),
        ...connectedSectionColumns.GROUPS(
          section.groupManagementSettings,
          objectRequests,
        ),
        ..._elementColumns,
      ];
    case SECTION_AVAILABILITY:
      return [
        ...connectedSectionColumns.SCHEDULING(
          section._id,
          formInstanceId,
          formId,
        ),
        ...availabilityCalendarColumns,
      ];
    default:
      return [..._elementColumns];
  }
};

/**
 * @function transformVerticalSectionValuesToTableRows
 * @description takes section values from a vertical section, and maps them to each respective column
 * @param {Array} values the vertical section values to extract the data from
 * @param {Array} columns the columns to use as transformation map
 */
const transformVerticalSectionValuesToTableRows = (
  values,
  columns,
  sectionId,
) => {
  const _data = columns.reduce((data, col) => {
    if (!values || !columns || !sectionId || !values.length || !columns.length)
      return data;
    // Find the element idx
    const elementIdx = values.findIndex((el) => el.elementId === col.dataIndex);
    if (invalidIndex(elementIdx)) return data;
    return { ...data, [col.dataIndex]: values[elementIdx].value };
  }, {});
  return [{ ..._data, rowKey: sectionId }];
};

/**
 * @function transformConnectedSectionValuesToTableRows
 * @description takes section values from a connected section, and maps them to each respective column
 * @param {Array} values the vertical section values to extract the data from
 * @param {Array} columns the columns to use as transformation map
 */
const transformConnectedSectionValuesToTableRows = (values, columns) => {
  if (
    !values ||
    !columns ||
    Object.keys(values).length === 0 ||
    !columns.length
  )
    return [];

  const _data = (Object.keys(values) || []).map((eventId) => {
    const _eventValues = columns.reduce((eventValues, col) => {
      // Find the element index
      const elementIdx = values[eventId].values.findIndex(
        (el) => el.elementId === col.dataIndex,
      );
      if (invalidIndex(elementIdx)) return eventValues;
      return {
        ...eventValues,
        [col.dataIndex]: values[eventId].values[elementIdx].value,
      };
    }, {});

    return {
      groupVal: values[eventId]?.groups,
      templateVal: values[eventId].template,
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
  if (
    !values ||
    !columns ||
    Object.keys(values).length === 0 ||
    !columns.length
  )
    return [];
  const _data = (Object.keys(values) || []).map((eventId) => {
    const _eventValues = columns.reduce((eventValues, col) => {
      const element = values[eventId].values.find(
        (el) => el.elementId === col.dataIndex,
      );
      if (!element) return eventValues;
      return {
        ...eventValues,
        [col.dataIndex]: element.value,
      };
    }, {});

    return {
      groupVal: values[eventId]?.groups,
      templateVal: values[eventId]?.template,
      ..._eventValues,
      rowKey: eventId,
    };
  });
  return _data;
};

/**
 * @function transformAvailabilityCalendarToTableRows
 * @description transform Availability Calendar events to table rows
 * @param {Array} values the values object to transform the data from
 */
const transformAvailabilityCalendarToTableRows = (values: any) => [
  ..._.flatten(Object.values(_.get(values, '[0].value'))).map((item: any) => ({
    ...item,
    rowKey: item.eventId,
  })),
];

/**
 * @function transformSectionValuesToTableRows
 * @description takes section value from a section of any type, and maps the values to each respective column
 * @param {Array || Object} values the values object to transform the data from
 * @param {Array} columns the columns to base the transformation on
 * @param {String} sectionId the id of the section
 * @param {String} sectionType the type of section
 */
export const transformSectionValuesToTableRows = (
  values,
  columns,
  sectionId,
  sectionType,
) => {
  switch (sectionType) {
    case SECTION_VERTICAL:
      return transformVerticalSectionValuesToTableRows(
        values,
        columns,
        sectionId,
      );
    case SECTION_TABLE:
      return transformTableSectionValuesToTableRows(values, columns);
    case SECTION_CONNECTED:
      return transformConnectedSectionValuesToTableRows(values, columns);
    case SECTION_AVAILABILITY:
      return transformAvailabilityCalendarToTableRows(values);
    default:
      return [];
  }
};
