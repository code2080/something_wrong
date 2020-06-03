// import _ from 'lodash';
import { datasourceValueTypes } from '../../Constants/datasource.constants';
import { determineSectionType } from '../../Utils/sections.helpers';
import {
  SECTION_VERTICAL,
  SECTION_TABLE,
  SECTION_CONNECTED
} from '../../Constants/sectionTypes.constants';

export const getTECoreAPIPayload = (value, datasource, state) => {
  if (!value) return null;
  const _datasource = datasource.split(',');
  if (!_datasource.length || _datasource.length < 2)
    return [{ valueType: undefined, extId: undefined }];
  let _retVal = [
    {
      valueType: datasourceValueTypes.TYPE_EXTID,
      extId: _datasource[0]
    }
  ];

  if (_datasource[1] === 'object')
    return [
      {
        valueType: datasourceValueTypes.OBJECT_EXTID,
        extId: value
      },
      ..._retVal
    ];
  return [
    {
      valueType: datasourceValueTypes.FIELD_VALUE,
      value
    },
    ..._retVal,
    {
      valueType: datasourceValueTypes.FIELD_EXTID,
      extId: _datasource[1]
    }
  ];
};

const initialState = {
  objects: [],
  fields: [],
  types: []
};

export const getExtIdPropsPayload = (sections, values, state) => {
  const elements = sections.reduce((allSections, section) => {
    const _elements = section.elements.reduce((allElements, element) => {
      if (element.datasource)
        return [
          ...allElements,
          ...getPayloadForSection(element, section, values, state)
        ];
      return allElements;
    }, []);
    return [...allSections, ..._elements];
  }, []);
  return elements.flat().reduce((retVal, element) => {
    if (!element) return retVal;
    if (element.valueType === datasourceValueTypes.OBJECT_EXTID) {
      const extIdIdx = retVal.objects.indexOf(element.extId);
      if (extIdIdx === -1)
        return {
          ...retVal,
          objects: [...retVal.objects, element.extId]
        };
      return retVal;
    }

    if (element.valueType === datasourceValueTypes.TYPE_EXTID) {
      const extIdIdx = retVal.types.indexOf(element.extId);
      if (extIdIdx === -1)
        return {
          ...retVal,
          types: [...retVal.types, element.extId]
        };
      return retVal;
    }

    if (element.valueType === datasourceValueTypes.FIELD_EXTID) {
      const extIdIdx = retVal.fields.indexOf(element.extId);
      if (extIdIdx === -1)
        return {
          ...retVal,
          fields: [...retVal.fields, element.extId]
        };
      return retVal;
    }
    return retVal;
  }, initialState);
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
  if (Array.isArray(el.value)) return el.value[0];
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
