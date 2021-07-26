import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import { createSelector } from 'reselect';
import { Field, selectExtIdLabel } from '../TE/te.selectors';
import {
  datasourceValueTypes,
  mapValueTypeToFieldName,
} from '../../Constants/datasource.constants';
import { determineSectionType } from '../../Utils/determineSectionType.helpers';
import {
  SECTION_VERTICAL,
  SECTION_TABLE,
  SECTION_CONNECTED,
} from '../../Constants/sectionTypes.constants';
import { initialState as emptyExtIdPropsPayload } from '../TE/te.helpers';
import { GetExtIdPropsPayload } from '../../Types/TECorePayloads.type';
import { TActivity } from 'Types/Activity.type';
import { ObjectRequest } from 'Redux/ObjectRequests/ObjectRequests.types';
import { ActivityValue } from 'Types/ActivityValue.type';

const selectIntegration = (state) => state.integration;
const selectReservationModes = (state) => state.integration.reservationModes;

export const selectValidTypesOnReservationMode = createSelector(
  selectReservationModes,
  (reservationModes) => (reservationMode) => {
    if (!reservationModes[reservationMode]) return [];
    const types = reservationModes[reservationMode].types;
    if (!Array.isArray(types)) return [];
    return types;
  },
);

export const selectValidFieldsOnReservationMode = createSelector(
  selectReservationModes,
  (reservationModes) => (reservationMode) => {
    if (!reservationModes[reservationMode]) return [];
    const fields = reservationModes[reservationMode].fields;
    if (!Array.isArray(fields)) return [];
    return fields;
  },
);

/**
 * @function getTECoreAPIPayload
 * @description transforms the element payload to be compatible with the TE Core API
 * @param {Mixed} value depending on element type; string, number, array, object
 * @param {String} datasource the selected datasource
 */

export const getTECoreAPIPayload = (
  value,
  datasource,
  objectRequests = <any[]>[],
) => {
  /**
   * No value or datasource is a no-op
   */
  if (!value || !datasource) return [];
  /**
   * Datasource is stored as a string
   */
  const _datasource = datasource.split(',');
  /**
   * Ensure the split array contains at least 2 elements
   */
  if (!_datasource.length || _datasource.length < 2) {
    return [{ valueType: undefined, extId: undefined }];
  }

  /**
   * Default return value
   */
  const _retVal = [
    {
      valueType: datasourceValueTypes.TYPE_EXTID,
      extId: _datasource[0],
    },
  ];

  /**
   * If the datasource selection is object
   */
  if (_datasource[1] === 'object') {
    const _value = Array.isArray(value) ? value : [value];
    return [
      ..._retVal,
      ...(_value || []).map((v) => {
        const objReq = objectRequests.find((req) => req._id === v);
        return {
          valueType: datasourceValueTypes.OBJECT_EXTID,
          extId: objReq ? objReq.replacementObjectExtId : v,
        };
      }),
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
        extId: curr,
      },
      {
        valueType: datasourceValueTypes.FIELD_VALUE,
        value: Array.isArray(value)
          ? value[0] && value[0][curr]
            ? value[0][curr]
            : ''
          : _.pickBy(value, (_, key) => key === curr),
        extId: curr,
      },
    ],
    [..._retVal],
  );
};

const extractPayloadFromElements = (elements) =>
  elements.reduce((elementsPayload, element) => {
    if (!element) return elementsPayload;
    const { valueType } = element;
    // We don't care about field values
    if (valueType === datasourceValueTypes.FIELD_VALUE) return elementsPayload;

    const fieldName = mapValueTypeToFieldName(valueType);

    return elementsPayload[fieldName].includes(element.extId)
      ? elementsPayload
      : {
          ...elementsPayload,
          [fieldName]: [...elementsPayload[fieldName], element.extId],
        };
  }, emptyExtIdPropsPayload);

const getExtIdPairsForActivity = (values: ActivityValue[]) => {
  // Each value contains the type of the values within, and the values (extIds) themselves
  const typeExtidPairs = values.flatMap((value) =>
    _.isEmpty(value.value)
      ? []
      : [
          [
            value.type === 'object' ? 'types' : `${value.type}s`,
            value.value as string,
            value.extId,
          ],
        ],
  ) as [type: 'fields' | 'types' | 'objects', value: string, extId: string][];
  return typeExtidPairs;
};

const extractPayloadFromActivities = (activities: TActivity[]) => {
  const allExtIdPairs = activities.flatMap((a) => [
    ...getExtIdPairsForActivity(a.values),
    ['objects', '', a.jointTeaching?.object],
  ]);

  return allExtIdPairs.reduce<GetExtIdPropsPayload>(
    (payload, [type, _, extId]) => {
      const newPayloadWithExtId = {
        ...payload,
        [type as string]: [...payload[type as string], extId],
      };
      return type === 'objects'
        ? {
            ...newPayloadWithExtId,
            objects: [...newPayloadWithExtId.objects],
          }
        : newPayloadWithExtId;
    },
    emptyExtIdPropsPayload,
  );
};

const extractPayloadFromObjectRequests = (requests) =>
  requests.reduce(
    (payload, req) => ({
      ...payload,
      objects: [
        ...payload.objects,
        req.objectExtId,
        req.replacementObjectExtId,
      ].filter(_.identity),
    }),
    { objects: [] },
  );

const extractPayloadFromTemplatesAndGroups = (
  sections: any[],
  submissionValues: { [sectionId: string]: any }[],
): Partial<GetExtIdPropsPayload> => {
  if (!sections || !submissionValues) return {};
  const arraySubmissionValues = Array.isArray(submissionValues)
    ? submissionValues
    : [submissionValues];

  const valuesForSections = sections
    .filter((section) => determineSectionType(section) !== SECTION_VERTICAL)
    .map((s) => s._id)
    .flatMap((sectionId) =>
      arraySubmissionValues.map((values) => values?.[sectionId]),
    ) as {
    [eventIdOrRowIdx: string]: {
      id: string;
      values: any[];
      template?: string;
      groups?: string[];
    };
  }[];

  const objects = valuesForSections
    .map((rowsObj) => Object.values(rowsObj))
    .flatMap((rows) =>
      rows.map((row: any) => [row.template, ...(row.groups ?? [])]),
    )
    .flat()
    .filter(Boolean);

  return {
    types: sections.reduce<string[]>(
      (val: string[], section: any) => [
        ...val,
        section?.activityTemplatesSettings?.datasource,
        section?.groupManagementSettings?.datasource,
      ],
      [],
    ),
    objects,
  };
};

const mergePayloads = (payloads) =>
  payloads.reduce((combinedPayload, payload) => {
    const payloadWithCorrectFields = { ...emptyExtIdPropsPayload, ...payload };
    return {
      ...combinedPayload,
      fields: _.uniq([
        ...combinedPayload.fields,
        ...payloadWithCorrectFields.fields,
      ]),
      objects: _.uniq([
        ...combinedPayload.objects,
        ...payloadWithCorrectFields.objects,
      ]),
      types: _.uniq([
        ...combinedPayload.types,
        ...payloadWithCorrectFields.types,
      ]),
    };
  }, emptyExtIdPropsPayload);

const getValueFromElement = (el) => {
  if (Array.isArray(el.value)) return el.value;
  if (el && el.value && el.value.value) return el.value.value;
  return null;
};

const getPayloadForVerticalSection = (element, values) =>
  values
    .filter((el) => el.elementId === element._id)
    .map((el) =>
      getTECoreAPIPayload(getValueFromElement(el), element.datasource),
    );

const getPayloadForTableSection = (element, values) =>
  Object.keys(values).reduce<any[]>((allRows, rowKey) => {
    const rowValues = values[rowKey]?.values || [];
    return [...allRows, ...getPayloadForVerticalSection(element, rowValues)];
  }, []);

const getPayloadForConnectedSection = (element, values) =>
  Object.keys(values).reduce<any[]>((allEvents, eventId) => {
    const event = values[eventId];
    return [
      ...allEvents,
      ...getPayloadForVerticalSection(element, event.values),
    ];
  }, []);

const getPayloadForSection = (element, section, values) => {
  if (!values || !values[section._id]) {
    process.env.NODE_ENV === 'development' &&
      console.log('No values for section ID', section._id, values, section);
    return [];
  }
  const sectionType = determineSectionType(section);
  if (sectionType === SECTION_VERTICAL) {
    return getPayloadForVerticalSection(element, values[section._id]);
  }
  if (sectionType === SECTION_CONNECTED) {
    return getPayloadForConnectedSection(element, values[section._id]);
  }
  if (sectionType === SECTION_TABLE) {
    return getPayloadForTableSection(element, values[section._id]);
  }
  return [];
};

const getElementsFromSection = (section, values) =>
  section.elements
    .reduce((elements, element) => {
      // We only care about the values if it is a datasource element
      return element.datasource
        ? [...elements, ...getPayloadForSection(element, section, values)]
        : elements;
    }, [])
    .flat();

const getAllElementsFromSections = (sections, submissionValues) =>
  sections.reduce(
    (elements, section) => [
      ...elements,
      ...(Array.isArray(submissionValues)
        ? submissionValues
            .map((values) => getElementsFromSection(section, values))
            .flat()
        : getElementsFromSection(section, submissionValues)),
    ],
    [],
  );

export const getExtIdPropsPayload = ({
  sections,
  submissionValues,
  activities = [],
  objectRequests = [],
  objectScope = null,
}: {
  sections: any;
  submissionValues: any;
  activities?: TActivity[];
  objectRequests?: ObjectRequest[];
  objectScope?: string | null;
}): GetExtIdPropsPayload => {
  if (isEmpty(sections) || isEmpty(submissionValues))
    return emptyExtIdPropsPayload;
  const elements = getAllElementsFromSections(sections, submissionValues);
  const submissionPayload = extractPayloadFromElements(elements);
  const activitiesPayload = extractPayloadFromActivities(activities);
  const objectScopePayload = objectScope ? { types: [objectScope] } : {};
  const objectRequestsPayload =
    extractPayloadFromObjectRequests(objectRequests);
  const templateAndGroupPayload = extractPayloadFromTemplatesAndGroups(
    sections,
    submissionValues,
  );
  return mergePayloads([
    submissionPayload,
    activitiesPayload,
    objectScopePayload,
    objectRequestsPayload,
    templateAndGroupPayload,
  ]);
};
export const getLabelsForDatasource = (payload, state) =>
  payload
    .filter(
      (el) =>
        el.valueType === datasourceValueTypes.OBJECT_EXTID ||
        el.valueType === datasourceValueTypes.FIELD_EXTID,
    )
    .reduce(
      (prev, curr) => ({
        ...prev,
        [curr.extId]: selectExtIdLabel(state)(
          mapValueTypeToFieldName(curr.valueType) as Field,
          curr.extId,
        ),
      }),
      {},
    );

export const selectLabelField = (type) =>
  createSelector(selectIntegration, (integration) => {
    if (!(type && integration.mappedObjectTypes[type])) return null;
    const mappedObjectType = integration.mappedObjectTypes[type];
    const { fields } = mappedObjectType;
    const labelField =
      fields && fields.find((field) => field.appProperty === 'LABEL');
    return labelField ? labelField.fieldExtId : null;
  });

export const selectObjectLabelsMapping = () =>
  createSelector(selectIntegration, integration => ({
    ...integration.mappedObjectsLabel,
  }));

export const selectFieldLabelsMapping = () =>
  createSelector(selectIntegration, integration => ({
    ...integration.mappedFieldsLabel,
  }));
