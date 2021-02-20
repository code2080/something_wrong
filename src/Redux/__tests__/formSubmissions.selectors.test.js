import { getSubmissionValues } from '../FormSubmissions/formSubmissions.selectors';

const fakeFormId = 'fakeFormId';
const fakeFormInstanceId = 'fakeFormInstanceId';

const mockConnectedSectionValues = {
  values: {
    '5f69f691c9e6eb00203d8e9f': {
      '16aad2f9-068b-476f-9010-87f02fe18cf5': {
<<<<<<< HEAD
        'eventId': '16aad2f9-068b-476f-9010-87f02fe18cf5',
        'startTime': '2020-09-23T08:45:00.000Z',
        'endTime': '2020-09-23T12:00:00.000Z',
        'values': [
          {
            'elementId': '5f69f691c9e6eb00203d8ea0',
            'value': [
=======
        eventId: '16aad2f9-068b-476f-9010-87f02fe18cf5',
        startTime: '2020-09-23T08:45:00.000Z',
        endTime: '2020-09-23T12:00:00.000Z',
        values: [
          {
            elementId: '5f69f691c9e6eb00203d8ea0',
            value: [
>>>>>>> development
              'room_näc-art-a601'
            ]
          },
          {
<<<<<<< HEAD
            'elementId': '5f69f691c9e6eb00203d8ea2',
            'value': [
=======
            elementId: '5f69f691c9e6eb00203d8ea2',
            value: [
>>>>>>> development
              'room_hgu-a-ub501'
            ]
          },
          {
<<<<<<< HEAD
            'elementId': '5f69f691c9e6eb00203d8ea4',
            'value': [
=======
            elementId: '5f69f691c9e6eb00203d8ea4',
            value: [
>>>>>>> development
              'room_näc-art-c621'
            ]
          }
        ],
<<<<<<< HEAD
        'sectionId': '5f69f691c9e6eb00203d8e9f'
      },
      '35e616cc-b3d0-40a5-8cb5-f6d8eb9cc21e': {
        'eventId': '35e616cc-b3d0-40a5-8cb5-f6d8eb9cc21e',
        'startTime': '2020-09-24T08:45:00.000Z',
        'endTime': '2020-09-24T12:45:00.000Z',
        'values': [
          {
            'elementId': '5f69f691c9e6eb00203d8ea0',
            'value': [
=======
        sectionId: '5f69f691c9e6eb00203d8e9f'
      },
      '35e616cc-b3d0-40a5-8cb5-f6d8eb9cc21e': {
        eventId: '35e616cc-b3d0-40a5-8cb5-f6d8eb9cc21e',
        startTime: '2020-09-24T08:45:00.000Z',
        endTime: '2020-09-24T12:45:00.000Z',
        values: [
          {
            elementId: '5f69f691c9e6eb00203d8ea0',
            value: [
>>>>>>> development
              '5f69f6dec9e6eb00203d8eb3'
            ]
          },
          {
<<<<<<< HEAD
            'elementId': '5f69f691c9e6eb00203d8ea2',
            'value': [
=======
            elementId: '5f69f691c9e6eb00203d8ea2',
            value: [
>>>>>>> development
              'room_hag-dra-b245'
            ]
          },
          {
<<<<<<< HEAD
            'elementId': '5f69f691c9e6eb00203d8ea4',
            'value': [
=======
            elementId: '5f69f691c9e6eb00203d8ea4',
            value: [
>>>>>>> development
              '5f69f73fc9e6eb00203d8eb6'
            ]
          }
        ],
<<<<<<< HEAD
        'sectionId': '5f69f691c9e6eb00203d8e9f'
=======
        sectionId: '5f69f691c9e6eb00203d8e9f'
>>>>>>> development
      }
    }
  },
  expected: [
    'room_näc-art-a601',
    'room_hgu-a-ub501',
    'room_näc-art-c621',
    '5f69f6dec9e6eb00203d8eb3',
    'room_hag-dra-b245',
    '5f69f73fc9e6eb00203d8eb6'
  ]
};

const mockTableSectionValues = {
  values: {
    '5eea6607e5a9d60020c6749f': {
      'row-0': [
        {
<<<<<<< HEAD
          'elementId': '5eea6607e5a9d60020c674a0',
          'value': 256
        },
        {
          'elementId': '5eea6608e5a9d60020c674a1',
          'value': 'asd'
=======
          elementId: '5eea6607e5a9d60020c674a0',
          value: 256
        },
        {
          elementId: '5eea6608e5a9d60020c674a1',
          value: 'asd'
>>>>>>> development
        }
      ],
      'row-1': [
        {
<<<<<<< HEAD
          'elementId': '5eea6607e5a9d60020c674a0',
          'value': 12
        },
        {
          'elementId': '5eea6608e5a9d60020c674a1',
          'value': 'grubb p'
=======
          elementId: '5eea6607e5a9d60020c674a0',
          value: 12
        },
        {
          elementId: '5eea6608e5a9d60020c674a1',
          value: 'grubb p'
>>>>>>> development
        }
      ],
      'row-2': [
        {
<<<<<<< HEAD
          'elementId': '5eea6607e5a9d60020c674a0',
          'value': 1337
        },
        {
          'elementId': '5eea6608e5a9d60020c674a1',
          'value': 'grupp a'
=======
          elementId: '5eea6607e5a9d60020c674a0',
          value: 1337
        },
        {
          elementId: '5eea6608e5a9d60020c674a1',
          value: 'grupp a'
>>>>>>> development
        }
      ]
    },
  },
  expected: [
    256,
    'asd',
    12,
    'grubb p',
    1337,
    'grupp a',
  ]
<<<<<<< HEAD
}
=======
};
>>>>>>> development

const mockRegularSectionValues = {
  values: {
    '5eea6607e5a9d60020c6749d': [
      {
<<<<<<< HEAD
        'elementId': '5eea6607e5a9d60020c6749e',
        'value': 'asd'
      },
      {
        'elementId': '5eea6607e5a9d60020c6749e',
        'value': 'test'
=======
        elementId: '5eea6607e5a9d60020c6749e',
        value: 'asd'
      },
      {
        elementId: '5eea6607e5a9d60020c6749e',
        value: 'test'
>>>>>>> development
      }
    ],
  },
  expected: [
    'asd',
    'test',
  ]
};

const mockConnectedSectionFilterValues = {
  values: {
    '5eea6608e5a9d60020c674a2': {
      '8a88c6d8-3454-479c-8126-4d28a43b05f8': {
<<<<<<< HEAD
        'eventId': '8a88c6d8-3454-479c-8126-4d28a43b05f8',
        'startTime': '2020-09-01T06:45:00.000Z',
        'endTime': '2020-09-01T11:00:00.000Z',
        'values': [
          {
            'elementId': '5eea6608e5a9d60020c674a3',
            'value': [
=======
        eventId: '8a88c6d8-3454-479c-8126-4d28a43b05f8',
        startTime: '2020-09-01T06:45:00.000Z',
        endTime: '2020-09-01T11:00:00.000Z',
        values: [
          {
            elementId: '5eea6608e5a9d60020c674a3',
            value: [
>>>>>>> development
              {
                'course.credits': [
                  '10.5'
                ]
              }
            ]
          },
          {
<<<<<<< HEAD
            'elementId': '5eea6608e5a9d60020c674a4',
            'value': [
=======
            elementId: '5eea6608e5a9d60020c674a4',
            value: [
>>>>>>> development
              {
                'room.campus2': [
                  'Lorensberg'
                ]
              }
            ]
          },
          {
<<<<<<< HEAD
            'elementId': '5eea6608e5a9d60020c674a5',
            'value': [
=======
            elementId: '5eea6608e5a9d60020c674a5',
            value: [
>>>>>>> development
              {
                'person.name': [
                  'Abdifitah Dhof Abdi'
                ]
              }
            ]
          }
        ],
<<<<<<< HEAD
        'sectionId': '5eea6608e5a9d60020c674a2'
      },
      '7905dd1f-1e0a-47d1-ab65-d2211f24c418': {
        'eventId': '7905dd1f-1e0a-47d1-ab65-d2211f24c418',
        'startTime': '2020-09-02T07:30:00.000Z',
        'endTime': '2020-09-02T10:00:00.000Z',
        'values': [
          {
            'elementId': '5eea6608e5a9d60020c674a3',
            'value': [
=======
        sectionId: '5eea6608e5a9d60020c674a2'
      },
      '7905dd1f-1e0a-47d1-ab65-d2211f24c418': {
        eventId: '7905dd1f-1e0a-47d1-ab65-d2211f24c418',
        startTime: '2020-09-02T07:30:00.000Z',
        endTime: '2020-09-02T10:00:00.000Z',
        values: [
          {
            elementId: '5eea6608e5a9d60020c674a3',
            value: [
>>>>>>> development
              {
                'course.credits': [
                  '1.5'
                ]
              }
            ]
          },
          {
<<<<<<< HEAD
            'elementId': '5eea6608e5a9d60020c674a4',
            'value': [
=======
            elementId: '5eea6608e5a9d60020c674a4',
            value: [
>>>>>>> development
              {
                'room.campus2': [
                  'Rosenlund'
                ]
              }
            ]
          },
          {
<<<<<<< HEAD
            'elementId': '5eea6608e5a9d60020c674a5',
            'value': [
=======
            elementId: '5eea6608e5a9d60020c674a5',
            value: [
>>>>>>> development
              {
                'person.name': [
                  'Abby Peterson'
                ]
              }
            ]
          }
        ],
<<<<<<< HEAD
        'sectionId': '5eea6608e5a9d60020c674a2'
=======
        sectionId: '5eea6608e5a9d60020c674a2'
>>>>>>> development
      }
    },
  },
  expected: [
    {
      'course.credits': [
        '10.5'
      ]
    },
    {
      'room.campus2': [
        'Lorensberg'
      ]
    },
    {
      'person.name': [
        'Abdifitah Dhof Abdi'
      ]
    },
    {
      'course.credits': [
        '1.5'
      ]
    },
    {
      'room.campus2': [
        'Rosenlund'
      ]
    },
    {
      'person.name': [
        'Abby Peterson'
      ]
    }
  ]
};

const getMockStateWithValues = values => ({
  submissions: {
    [fakeFormId]: {
      [fakeFormInstanceId]: {
        _id: fakeFormInstanceId,
        formId: fakeFormId,
        values: { ...values }
      }
    }
  }
});

const curriedGetSubmissionValues = getSubmissionValues(fakeFormId, fakeFormInstanceId);

const testValuesEqualsExpected = ({ values, expected }) => {
  const state = getMockStateWithValues(values);
  const extractedValues = curriedGetSubmissionValues(state);
  expect(extractedValues).toEqual(expected);
};

it('should handle no values', () => {
  const values = curriedGetSubmissionValues(getMockStateWithValues({}));
  expect(values).toEqual([]);
});

it('should extract values from connected section', () => {
  testValuesEqualsExpected(mockConnectedSectionValues);
});

it('should extract values from table section', () => {
  testValuesEqualsExpected(mockTableSectionValues);
});

it('should extract values from regular section', () => {
  testValuesEqualsExpected(mockRegularSectionValues);
});

it('should extract values from submission with multiple type of sections', () => {
  testValuesEqualsExpected({
    values: {
      ...mockRegularSectionValues.values,
      ...mockConnectedSectionValues.values,
      ...mockTableSectionValues.values
    },
    expected: [
      ...mockRegularSectionValues.expected,
      ...mockConnectedSectionValues.expected,
      ...mockTableSectionValues.expected
    ]
  });
});

it('should extract values form connected section with filter values', () => {
  testValuesEqualsExpected(mockConnectedSectionFilterValues);
});
