import { ActivityValue } from 'Types/Activity/ActivityValue.type';
import { getActivityValuesBasedOnElement } from '../helpers';

const sections: any = [
  {
    _id: '6107a307d3241f0026cdb82d',
    elements: [
      {
        isRequired: false,
        allowMultiple: false,
        isSearchable: false,
        isStatic: false,
        defaultValue: [],
        options: [
          {
            label: 'False',
            value: 'false',
          },
          {
            label: 'True',
            value: 'true',
          },
        ],
        datasource: null,
        _id: '6107a307d3241f0026cdb82b',
        elementId: '5c59a0fe1a47001ad08cf1d5',
        label: 'Checkbox group',
        objectRelations: null,
        objectProperties: '{}',
        rules: null,
        objectSelectionSettings: {
          newObject: false,
          missingObject: false,
          editObject: false,
          _id: '6107a307d3241f0026cdb832',
        },
        updatedAt: '2021-08-02T07:47:19.118Z',
        createdAt: '2021-08-02T07:47:19.118Z',
      },
      {
        isRequired: false,
        allowMultiple: false,
        isSearchable: false,
        isStatic: false,
        defaultValue: '',
        options: [],
        datasource: null,
        _id: '6107a307d3241f0026cdb82c',
        elementId: '5c3248b3e3ae55831d79a27d',
        label: 'Check box field',
        objectRelations: null,
        objectProperties: '{}',
        rules: null,
        objectSelectionSettings: {
          newObject: false,
          missingObject: false,
          editObject: false,
          _id: '6107a307d3241f0026cdb834',
        },
        updatedAt: '2021-08-02T07:47:19.118Z',
        createdAt: '2021-08-02T07:47:19.118Z',
      },
    ],
  },
];
const activityValues = [
  {
    type: 'object',
    extId: 'accinfo',
    value: ['false'],
    submissionValue: ['false'],
    submissionValueType: 'FREE_TEXT',
    valueMode: 'FROM_SUBMISSION',
    sectionId: '6107a307d3241f0026cdb82d',
    elementId: '6107a307d3241f0026cdb82c',
    eventId: '1bb51bf1-d023-442f-9d0d-54c36acb6546',
    rowIdx: null,
  },
  {
    type: 'object',
    extId: 'accinfo',
    value: ['true'],
    submissionValue: ['true'],
    submissionValueType: 'FREE_TEXT',
    valueMode: 'FROM_SUBMISSION',
    sectionId: '6107a307d3241f0026cdb82d',
    elementId: '6107a307d3241f0026cdb82c',
    eventId: '1bb51bf1-d023-442f-9d0d-54c36acb6546',
    rowIdx: null,
  },
  {
    type: 'object',
    extId: 'accinfo',
    value: ['false'],
    submissionValue: ['false'],
    submissionValueType: 'FREE_TEXT',
    valueMode: 'FROM_SUBMISSION',
    sectionId: '6107a307d3241f0026cdb82d',
    elementId: '6107a307d3241f0026cdb82b',
    eventId: '1bb51bf1-d023-442f-9d0d-54c36acb6546',
    rowIdx: null,
  },
  {
    type: 'object',
    extId: 'accinfo',
    value: ['true'],
    submissionValue: ['true'],
    submissionValueType: 'FREE_TEXT',
    valueMode: 'FROM_SUBMISSION',
    sectionId: '6107a307d3241f0026cdb82d',
    elementId: '6107a307d3241f0026cdb82b',
    eventId: '1bb51bf1-d023-442f-9d0d-54c36acb6546',
    rowIdx: null,
  },
];

describe('getActivityValuesBasedOnElement tests', () => {
  const res = getActivityValuesBasedOnElement(
    activityValues as ActivityValue[],
    sections,
  );
  it('For checkbox element, render 1 for true and 0 for false', () => {
    expect(res[0].value[0]).toBe('0');
    expect(res[1].value[0]).toBe('1');
  });

  it('For other elements, keep current values', () => {
    expect(res[2].value[0]).toBe('false');
    expect(res[3].value[0]).toBe('true');
  });
});
