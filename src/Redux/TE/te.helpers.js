import { findElementValueInSubmission } from '../../Utils/elementHelpers';

const initialState = {
  objects: [],
  fields: [],
  types: [],
};

const teTypes = {
  FIELD: 'fields',
  OBJECT: 'objects',
  TYPE: 'types',
};

const determineTEType = element => {
  const { datasource } = element;
  if (!datasource) return null;
  const _datasource = datasource.split(',');
  if (!_datasource[1]) return null;
  if (_datasource[1] === 'object') return teTypes.OBJECT;
  return teTypes.FIELD;
};

export const findTEValuesInSubmission = (sections, values) => {
  // Find the different TE elements
  const elements = sections.reduce((allSections, section) => {
    const _section = section.elements.reduce((elements, element) => {
      const dataType = determineTEType(element);
      if (!dataType) return elements;
      return {
        ...elements,
        [dataType]: [
          ...elements[dataType],
          { elementId: element._id, sectionId: section._id },
        ],
      };
    }, initialState);
    return {
      ...allSections,
      fields: [
        ...allSections.fields,
        ..._section.fields,
      ],
      objects: [
        ...allSections.objects,
        ..._section.objects,
      ],
      types: [
        ...allSections.types,
        ..._section.types,
      ],
    };
  }, initialState);
  // Find their respective values
  return Object.keys(elements).reduce((elementValues, dataType) => {
    const elementsInDataType = elements[dataType];
    const _elementValues = elementsInDataType.reduce(
      (allValues, element) => [
        ...allValues,
        ...findElementValueInSubmission(element, sections, values)
      ],
      []
    );
    return {
      ...elementValues,
      [dataType]: [
        ..._elementValues,
      ],
    };
  }, initialState);
};
