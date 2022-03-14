import { getExtIdPropsPayload } from '../integration.selectors';
import * as mockData from '../../../Mock/Form';
import { TActivity } from '../../../Types/Activity/Activity.type';

describe('integration selectors tests', () => {
  describe('getExtIdPropsPayload', () => {
    const sections = [
      {
        calendarSettings: {
          step: 30,
          useTimeslots: false,
          hideWeekend: false,
          showWeekNumber: false,
          durationTitle: 'Duration',
          useDuration: false,
          timeslots: [],
        },
        name: 'New  table block',
        isCombo: false,
        isConnected: false,
        _id: '608911ba4f300b00222d2d93',
        settings: {
          minRow: 1,
          maxRow: null,
          hasMultipleValues: true,
        },
        activityTemplatesSettings: {
          isEnabled: true,
          objectFilters: '{}',
          datasource: 'activity',
          allowToCreateNewObject: false,
          _id: '608911ba4f300b00222d2d94',
        },
        groupManagementSettings: {
          isEnabled: true,
          objectFilters: '{}',
          datasource: 'courseevt_grp',
          allowToCreateNewObject: false,
          _id: '608911ba4f300b00222d2d95',
          objectProperties: {
            'general.department': ['Energi och teknik'],
          },
        },
        elements: [
          {
            isRequired: false,
            allowMultiple: false,
            isSearchable: false,
            isStatic: false,
            defaultValue: null,
            options: [],
            datasource: 'room,object',
            objectFilters: '{}',
            _id: '608911ba4f300b00222d2d96',
            elementId: '5d8331e47cd014cfb7e15394',
            label: 'Room test',
            designerNote: 'To be pruned',
            rules: null,
            objectSelectionSettings: {
              newObject: false,
              missingObject: false,
              editObject: false,
              _id: '608911ba4f300b00222d2d97',
            },
            updatedAt: '2021-04-28T07:41:46.775Z',
            createdAt: '2021-04-28T07:41:46.775Z',
          },
          {
            isRequired: false,
            allowMultiple: false,
            isSearchable: false,
            isStatic: false,
            defaultValue: 'This is a text element',
            options: [],
            datasource: null,
            objectFilters: '{}',
            _id: '608911ba4f300b00222d2d98',
            elementId: '5c3248b3e3ae55831d79a276',
            label: 'Text element',
            designerNote: 'First',
            rules: {
              minLength: 5,
            },
            objectSelectionSettings: {
              newObject: false,
              missingObject: false,
              editObject: false,
              _id: '608911ba4f300b00222d2d99',
            },
            updatedAt: '2021-04-28T07:41:46.775Z',
            createdAt: '2021-04-28T07:41:46.775Z',
          },
          {
            isRequired: false,
            allowMultiple: false,
            isSearchable: false,
            isStatic: false,
            defaultValue: 10,
            options: [],
            datasource: null,
            objectFilters: '{}',
            _id: '608911ba4f300b00222d2d9a',
            elementId: '5c3248b3e3ae55831d79a277',
            label: 'Numbah',
            rules: null,
            objectSelectionSettings: {
              newObject: false,
              missingObject: false,
              editObject: false,
              _id: '608911ba4f300b00222d2d9b',
            },
            updatedAt: '2021-04-28T07:41:46.775Z',
            createdAt: '2021-04-28T07:41:46.775Z',
          },
          {
            isRequired: false,
            allowMultiple: false,
            isSearchable: false,
            isStatic: false,
            defaultValue: {
              startTime: '2022-05-30T22:00:00.000Z',
              endTime: '2022-05-31T21:59:59.999Z',
            },
            options: [],
            datasource: null,
            objectFilters: '{}',
            _id: '608911ba4f300b00222d2d9c',
            elementId: '5c3248b3e3ae55831d79a279',
            label: 'Date',
            rules: null,
            objectSelectionSettings: {
              newObject: false,
              missingObject: false,
              editObject: false,
              _id: '608911ba4f300b00222d2d9d',
            },
            updatedAt: '2021-04-28T07:41:46.775Z',
            createdAt: '2021-04-28T07:41:46.775Z',
          },
        ],
        updatedAt: '2021-04-28T07:41:46.775Z',
        createdAt: '2021-04-28T07:41:46.775Z',
      },
    ];

    const submissionValues = [
      {
        '608911ba4f300b00222d2d93': {
          'row-0': {
            values: [
              {
                elementId: '608911ba4f300b00222d2d96',
                value: ['room_best_umeå_lokal_31-40'],
              },
              {
                elementId: '608911ba4f300b00222d2d98',
                value: 'This is a text element',
              },
              {
                elementId: '608911ba4f300b00222d2d9a',
                value: 10,
              },
              {
                elementId: '608911ba4f300b00222d2d9c',
                value: {
                  startTime: '2022-05-30T22:00:00.000Z',
                  endTime: '2022-05-31T21:59:59.999Z',
                },
              },
            ],
            id: 'row-0',
            template: 'course_activity_self_studies',
          },
          'row-1-0': {
            values: [
              {
                elementId: '608911ba4f300b00222d2d96',
                value: ['room_best_uppsala_lokal_31-40'],
              },
              {
                elementId: '608911ba4f300b00222d2d98',
                value: 'This is a text element 1-1',
              },
              {
                elementId: '608911ba4f300b00222d2d9a',
                value: 10,
              },
              {
                elementId: '608911ba4f300b00222d2d9c',
                value: {
                  startTime: '2022-05-30T22:00:00.000Z',
                  endTime: '2022-05-31T21:59:59.999Z',
                },
              },
            ],
            id: 'row-1-0',
            template: 'resource_activity_internal_activity',
            parentId: 'row-1',
            groups: ['courseevt_MS0065-10185-HT2019'],
          },
          'row-1-1': {
            values: [
              {
                elementId: '608911ba4f300b00222d2d96',
                value: ['room_best_uppsala_lokal_31-40'],
              },
              {
                elementId: '608911ba4f300b00222d2d98',
                value: 'This is a text element 1-2',
              },
              {
                elementId: '608911ba4f300b00222d2d9a',
                value: 10,
              },
              {
                elementId: '608911ba4f300b00222d2d9c',
                value: {
                  startTime: '2022-05-30T22:00:00.000Z',
                  endTime: '2022-05-31T21:59:59.999Z',
                },
              },
            ],
            id: 'row-1-1',
            template: 'resource_activity_internal_activity',
            parentId: 'row-1',
            groups: ['courseevt_MX0126-20092-HT2019'],
          },
          'row-2': {
            values: [
              {
                elementId: '608911ba4f300b00222d2d96',
                value: ['room_best_alnarp_lokal_41-50'],
              },
              {
                elementId: '608911ba4f300b00222d2d98',
                value: 'Test element',
              },
              {
                elementId: '608911ba4f300b00222d2d9a',
                value: 10,
              },
              {
                elementId: '608911ba4f300b00222d2d9c',
                value: {
                  startTime: '2022-05-30T22:00:00.000Z',
                  endTime: '2022-05-31T21:59:59.999Z',
                },
              },
            ],
            id: 'row-2',
            template: 'resource_activity_internal_activity',
          },
          'row-3-0': {
            values: [
              {
                elementId: '608911ba4f300b00222d2d96',
                value: ['room_best_alnarp_lokal_21-30'],
              },
              {
                elementId: '608911ba4f300b00222d2d98',
                value: 'This is a text element 2-1',
              },
              {
                elementId: '608911ba4f300b00222d2d9a',
                value: 10,
              },
              {
                elementId: '608911ba4f300b00222d2d9c',
                value: {
                  startTime: '2022-05-30T22:00:00.000Z',
                  endTime: '2022-05-31T21:59:59.999Z',
                },
              },
            ],
            id: 'row-3-0',
            groups: ['courseevt_MX0131-20093-HT2019'],
            template: 'course_activity_covid',
            parentId: 'row-3',
          },
          'row-3-1': {
            values: [
              {
                elementId: '608911ba4f300b00222d2d96',
                value: ['room_best_alnarp_lokal_21-30'],
              },
              {
                elementId: '608911ba4f300b00222d2d98',
                value: 'This is a text element 2-2',
              },
              {
                elementId: '608911ba4f300b00222d2d9a',
                value: 10,
              },
              {
                elementId: '608911ba4f300b00222d2d9c',
                value: {
                  startTime: '2022-05-30T22:00:00.000Z',
                  endTime: '2022-05-31T21:59:59.999Z',
                },
              },
            ],
            id: 'row-3-1',
            groups: ['courseevt_MX0126-20092-HT2019'],
            template: 'course_activity_covid',
            parentId: 'row-3',
          },
          'row-3-2': {
            values: [
              {
                elementId: '608911ba4f300b00222d2d96',
                value: ['room_best_alnarp_lokal_21-30'],
              },
              {
                elementId: '608911ba4f300b00222d2d98',
                value: 'This is a text element 2-3',
              },
              {
                elementId: '608911ba4f300b00222d2d9a',
                value: 10,
              },
              {
                elementId: '608911ba4f300b00222d2d9c',
                value: {
                  startTime: '2022-05-30T22:00:00.000Z',
                  endTime: '2022-05-31T21:59:59.999Z',
                },
              },
            ],
            id: 'row-3-2',
            groups: ['courseevt_MS0071-20156-HT2019'],
            template: 'course_activity_covid',
            parentId: 'row-3',
          },
        },
      },
    ];

    const testData = [
      {
        input: { sections, submissionValues },
        expected: {
          objects: [
            'room_best_umeå_lokal_31-40',
            'room_best_uppsala_lokal_31-40',
            'room_best_alnarp_lokal_41-50',
            'room_best_alnarp_lokal_21-30',
            'course_activity_self_studies',
            'resource_activity_internal_activity',
            'courseevt_MS0065-10185-HT2019',
            'courseevt_MX0126-20092-HT2019',
            'course_activity_covid',
            'courseevt_MX0131-20093-HT2019',
            'courseevt_MS0071-20156-HT2019',
          ],
          fields: [],
          types: ['room', 'activity', 'courseevt_grp'],
        },
      },
      {
        input: {
          sections: undefined,
          submissionValues: undefined,
        },
        expected: { objects: [], types: [], fields: [] },
      },
      {
        input: {
          sections: mockData.form.sections,
          submissionValues: mockData.submissions.map((s) => s.values),
          activities: mockData.activities,
          objectScope: mockData.form.objectScope,
        },
        expected: {
          fields: ['room.type', 'res.restext', 'res.comment'],
          objects: [
            'person_atsi0001',
            'person_auba0002',
            'course_activity_discussion',
            'course_activity_lecture',
            null,
          ],
          types: [
            'person_staff',
            'room',
            'activity_teach',
            'equipment',
            'courseevt',
            null,
          ],
        },
      },
      {
        input: {
          sections: mockData.form.sections,
          submissionValues: mockData.submissions.map((s) => s.values),
          objectScope: mockData.form.objectScope,
          activities: mockData.activities.map(
            (a) =>
              ({
                ...a,
                jointTeaching: {
                  object: 'jointTeachingObj',
                  typeExtId: mockData.form.objectScope,
                },
              } as TActivity),
          ),
        },
        expected: {
          fields: ['room.type', 'res.restext', 'res.comment'],
          objects: [
            'person_atsi0001',
            'person_auba0002',
            'course_activity_discussion',
            'course_activity_lecture',
            'jointTeachingObj',
          ],
          types: [
            'person_staff',
            'room',
            'activity_teach',
            'equipment',
            'courseevt',
            null,
          ],
        },
      },
    ];
    it.each(testData.map(({ input, expected }) => [input, expected]))(
      'Should get all expected extids',
      (input, expected) => {
        const payload = getExtIdPropsPayload(input as any);
        expect(payload).toEqual(expected);
      },
    );
  });
});
