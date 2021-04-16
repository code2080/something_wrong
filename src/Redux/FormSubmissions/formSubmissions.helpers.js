import _ from 'lodash';

const sectionType = {
  EMPTY: 'EMPTY',
  CONNECTED: 'CONNECTED',
  REGULAR: 'REGULAR',
  TABLE: 'TABLE',
};

const determineSectionTypeFromData = (sectionData) => {
  if (_.isEmpty(sectionData)) return sectionType.EMPTY;
  if (Array.isArray(sectionData)) return sectionType.REGULAR;

  const recurringSectionData = _.flatMap(sectionData);
  if (_.isEmpty(recurringSectionData)) return sectionType.EMPTY;

  if (_.head(recurringSectionData).eventId) return sectionType.CONNECTED;
  return sectionType.TABLE;
};

const extractValuesFromSectionData = (sectionData) => {
  switch (determineSectionTypeFromData(sectionData)) {
    case sectionType.REGULAR:
      return sectionData.reduce(
        (values, element) => [...values, element.value],
        [],
      );
    case sectionType.TABLE:
      return Object.values(sectionData).reduce(
        (values, row) => [
          ...values,
          ...row.values.reduce(
            (elVals, element) => [...elVals, element.value],
            [],
          ),
        ],
        [],
      );
    case sectionType.CONNECTED:
      return Object.values(sectionData).reduce(
        (values, event) => [
          ...values,
          ...event.values
            .filter((element) => element.value)
            .reduce((elVals, element) => [...elVals, element.value], []),
        ],
        [],
      );
    default:
      return [];
  }
};

export const getSubmissionValues = (formInstance) =>
  formInstance
    ? Object.entries(formInstance.values).reduce(
        (values, [sectionId, sectionData]) => [
          ...values,
          {
            sectionId,
            sectionValues: extractValuesFromSectionData(sectionData),
          },
        ],
        [],
      )
    : [];
