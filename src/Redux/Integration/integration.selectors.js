import _ from 'lodash';
import { selectExtIdLabel } from '../TE/te.selectors'
import { datasourceValueTypes, mapValueTypeToFieldName } from '../../Constants/datasource.constants';
import { determineSectionType } from '../../Utils/determineSectionType.helpers';
import {
  SECTION_VERTICAL,
  SECTION_TABLE,
  SECTION_CONNECTED
} from '../../Constants/sectionTypes.constants';
import { initialState } from '../TE/te.helpers';

/**
 * @function getTECoreAPIPayload
 * @description transforms the element payload to be compatible with the TE Core API
 * @param {Mixed} value depending on element type; string, number, array, object
 * @param {String} datasource the selected datasource
 */

export const getTECoreAPIPayload = (value, datasource) => {
  /**
   * No value is a no-op
   */
  if (!value) return null;
  /**
   * Datasource is stored as a string
   */
  const _datasource = datasource.split(',');
  /**
   * Ensure the split array contains at least 2 elements
   */
  if (!_datasource.length || _datasource.length < 2)
    return [{ valueType: undefined, extId: undefined }];

  /**
   * Default return value
   */
  let _retVal = [
    {
      valueType: datasourceValueTypes.TYPE_EXTID,
      extId: _datasource[0]
    }
  ];

  /**
   * If the datasource selection is object
   */
  if (_datasource[1] === 'object') {
    const _value = Array.isArray(value) ? value : [value];
    return [
      ..._retVal,
      ...(_value || []).map(v => ({
        valueType: datasourceValueTypes.OBJECT_EXTID,
        extId: v,
      })),
    ];
  }
  /**
   * If it's not "object" => the values contain different fields
   * We need to iterate over the fields and construct the payload
   */
  return _datasource.slice(1).reduce(
    (prev, curr) => [
      ...prev,
      {
        valueType: datasourceValueTypes.FIELD_EXTID,
        extId: curr
      },
      {
        valueType: datasourceValueTypes.FIELD_VALUE,
        value: Array.isArray(value)
          ? value[0] && value[0][curr]
            ? value[0][curr]
            : ''
          : value,
        extId: curr,
      }
    ],
    [..._retVal]
  );
};

const getElementsFromSection = (section, values) => section.elements.reduce((elements, element) => {
  // We only care about the values if it is a datasource element
  return element.datasource ? [...elements, ...getPayloadForSection(element, section, values)]
    : elements;
}, []).flat();

const getAllElementsFromSections = (sections, submissionValues) => sections.reduce((elements, section) => [
  ...elements,
  ...getElementsFromSection(section, submissionValues)
], []);



const extractPayloadFromElements = (elements) => elements.reduce((elementsPayload, element) => {
  if (!element) return elementsPayload;
  const { valueType } = element;
  // We don't care about field values
  if (valueType == datasourceValueTypes.FIELD_VALUE) return elementsPayload;

  const fieldName = mapValueTypeToFieldName(valueType);

  return elementsPayload[fieldName].includes(element.extId)
    ? elementsPayload
    : {
      ...elementsPayload,
      [fieldName]: [
        ...elementsPayload[fieldName],
        element.extId
      ]
    };
}, initialState);

const getExtIdPairsForActivity = values => {
  // Each value contains the type of the values within, and the values (extIds) themselves
  const typeExtidPairs = values.reduce((typeExtidPairs, value) =>
    [
      ...typeExtidPairs,
      [
        value.type,
        value.type === 'field'
          ? [value.extId]
          : value.value
      ]
    ]
    , []);
  return typeExtidPairs;
};

const extractPayloadFromActivities = activities => {
  const allExtIdPairs = activities.reduce((extIdPairs, activity) => {
    const extIdPairsForActivity = getExtIdPairsForActivity(activity.values);
    return [...extIdPairs, ...extIdPairsForActivity];
  }, []);

  return allExtIdPairs.reduce((payload, [type, values]) => ({
    ...payload,
    [`${type}s`]: _.uniq([
      ...payload[`${type}s`],
      ...values,
    ]),
  }), initialState);
};

const injectObjectScopeIntoPayload = (payload, objectScope) => objectScope && objectScope.length > 0
  ? {
    ...payload,
    types:
      [...payload.types,
        objectScope
      ]
  }
  : payload;

  const mergePayloads = payloads => payloads.reduce((combinedPayload, payload) => ({
    ...combinedPayload,
    fields: [
      ...combinedPayload.fields,
      ...payload.fields
    ],
    objects: [
      ...combinedPayload.objects,
      ...payload.objects
    ],
    types: [
      ...combinedPayload.types,
      ...payload.types
    ]
  }), initialState);
  
  export const getExtIdPropsPayload = ({ sections, submissionValues, activities = [], objectScope = null }) => {
    const elements = getAllElementsFromSections(sections, submissionValues);
    const submissionPayload = extractPayloadFromElements(elements);
    const activitiesPayload = extractPayloadFromActivities(activities);
    const payloadWithObjectScope = objectScope ? injectObjectScopeIntoPayload(activitiesPayload, objectScope) : activitiesPayload;
    return mergePayloads([submissionPayload, payloadWithObjectScope]);
  };


const getPayloadForSection = (element, section, values, state) => {
  if (!values[section._id] && process.env.NODE_ENV === 'development') {
    console.log('No values for section ID', section._id, values, section);
    return [];
  }
  const sectionType = determineSectionType(section);
  if (sectionType === SECTION_VERTICAL) {
    return getPayloadForVerticalSection(element, values[section._id], state);
  }
  if (sectionType === SECTION_CONNECTED) {
    return getPayloadForConnectedSection(element, values[section._id], state);
  }
  if (sectionType === SECTION_TABLE) {
    return getPayloadForTableSection(element, values[section._id], state);
  }
  return [];
};

const getValueFromElement = el => {
  if (Array.isArray(el.value)) return el.value;
  if (el && el.value && el.value.value) return el.value.value;
  return null;
};

const getPayloadForVerticalSection = (element, values, state) =>
  values
    .filter(el => el.elementId === element._id)
    .map(el =>
      getTECoreAPIPayload(getValueFromElement(el), element.datasource, state)
    );

const getPayloadForTableSection = (element, values, state) =>
  Object.keys(values).reduce((allRows, rowKey) => {
    const rowValues = values[rowKey];
    return [
      ...allRows,
      ...getPayloadForVerticalSection(element, rowValues, state)
    ];
  }, []);

const getPayloadForConnectedSection = (element, values, state) =>
  Object.keys(values).reduce((allEvents, eventId) => {
    const event = values[eventId];
    return [
      ...allEvents,
      ...getPayloadForVerticalSection(element, event.values, state)
    ];
  }, []);

const getLabelFromExtId = (state, type, extId) => {
  const label =_.get(
    state,
    `te.extIdProps.${type === datasourceValueTypes.OBJECT_EXTID ? 'objects' : 'fields'}[${extId}].label`,
    extId
  );
  return _.isEmpty(label) ? extId : label;
}
export const getLabelsForDatasource = (payload, state) => payload
  .filter(
    el =>
      el.valueType === datasourceValueTypes.OBJECT_EXTID ||
      el.valueType === datasourceValueTypes.FIELD_EXTID
  )
  .reduce(
    (prev, curr) => ({
      ...prev,
      [curr.extId]: getLabelFromExtId(state, curr.valueType, curr.extId),
    }),
    {}
  );
