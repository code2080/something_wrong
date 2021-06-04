import _ from 'lodash';
// import moment from 'moment';
// import { ActivityValue, CategoryField } from '../ActivityValue.type';
import { TActivity } from '../../Types/Activity.type';
import { TFormInstance } from '../../Types/FormInstance.type';
import { getFilterLookupMap } from '../../Utils/activities.helpers';

const activities = {
  '601048c0ea0edb00206dae89': [
    {
      _id: '6093a60ecdb17300258c7ae4',
      formId: '60104814ea0edb00206dadfe',
      formInstanceId: '601048c0ea0edb00206dae89',
      tagId: null,
      sectionId: '601048afea0edb00206dae62',
      eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
      rowIdx: null,
      activityStatus: 'NOT_SCHEDULED',
      errorDetails: {},
      schedulingTimestamp: null,
      timing: [
        {
          type: 'timing',
          extId: '$init',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'mode',
          value: 'EXACT',
          submissionValue: ['EXACT'],
          submissionValueType: 'TIMING',
          valueMode: 'FROM_SUBMISSION',
          sectionId: null,
          elementId: null,
          eventId: null,
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'startDate',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'endDate',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'startTime',
          value: '2021-02-02T08:00:00Z',
          submissionValue: ['2021-02-02T08:00:00Z'],
          submissionValueType: 'TIMING',
          valueMode: 'FROM_SUBMISSION',
          sectionId: null,
          elementId: null,
          eventId: null,
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'endTime',
          value: '2021-02-02T10:15:00Z',
          submissionValue: ['2021-02-02T10:15:00Z'],
          submissionValueType: 'TIMING',
          valueMode: 'FROM_SUBMISSION',
          sectionId: null,
          elementId: null,
          eventId: null,
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'length',
          value: null,
          submissionValue: {
            categories: [
              {
                id: 'room.type',
                values: ['Datorsal'],
              },
            ],
            searchString: null,
            searchFields: null,
          },
          submissionValueType: 'FILTER',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae69',
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'padding',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'weekday',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'time',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
      ],
      values: [
        {
          type: 'object',
          extId: 'room',
          value: {
            categories: [
              {
                id: 'room.type',
                values: ['Datorsal'],
              },
            ],
            searchString: null,
            searchFields: null,
          },
          submissionValue: {
            categories: [
              {
                id: 'room.type',
                values: ['Datorsal'],
              },
            ],
            searchString: null,
            searchFields: null,
          },
          submissionValueType: 'FILTER',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae69',
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'person_staff',
          value: ['person_atsi0001'],
          submissionValue: ['person_atsi0001'],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae67',
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'courseevt',
          value: ['courseevt_BI1143-40049-VT2021'],
          submissionValue: ['courseevt_BI1143-40049-VT2021'],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: 'scopedObject',
          elementId: null,
          eventId: null,
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'equipment',
          value: [],
          submissionValue: [],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae6d',
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'activity_teach',
          value: ['course_activity_discussion'],
          submissionValue: ['course_activity_discussion'],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae6b',
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'field',
          extId: 'res.restext',
          value: 'Test',
          submissionValue: ['Test'],
          submissionValueType: 'FREE_TEXT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae63',
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
        {
          type: 'field',
          extId: 'res.comment',
          value: 'Testar lite bara på beta',
          submissionValue: ['Testar lite bara på beta'],
          submissionValueType: 'FREE_TEXT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae65',
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          rowIdx: null,
        },
      ],
      sequenceIdx: 0,
    },
    {
      _id: '6093a60ecdb17300258c7ae5',
      formId: '60104814ea0edb00206dadfe',
      formInstanceId: '601048c0ea0edb00206dae89',
      tagId: null,
      sectionId: '601048afea0edb00206dae62',
      eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
      rowIdx: null,
      activityStatus: 'NOT_SCHEDULED',
      errorDetails: {},
      schedulingTimestamp: null,
      timing: [
        {
          type: 'timing',
          extId: '$init',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'mode',
          value: 'EXACT',
          submissionValue: ['EXACT'],
          submissionValueType: 'TIMING',
          valueMode: 'FROM_SUBMISSION',
          sectionId: null,
          elementId: null,
          eventId: null,
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'startDate',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'endDate',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'startTime',
          value: '2021-02-03T11:00:00Z',
          submissionValue: ['2021-02-03T11:00:00Z'],
          submissionValueType: 'TIMING',
          valueMode: 'FROM_SUBMISSION',
          sectionId: null,
          elementId: null,
          eventId: null,
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'endTime',
          value: '2021-02-03T14:00:00Z',
          submissionValue: ['2021-02-03T14:00:00Z'],
          submissionValueType: 'TIMING',
          valueMode: 'FROM_SUBMISSION',
          sectionId: null,
          elementId: null,
          eventId: null,
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'length',
          value: 120,
          submissionValue: {
            categories: [
              {
                id: 'room.type',
                values: ['Hörsal, gradäng'],
              },
            ],
            searchString: null,
            searchFields: null,
          },
          submissionValueType: 'FILTER',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae69',
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'padding',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'weekday',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'time',
          value: null,
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
      ],
      values: [
        {
          type: 'object',
          extId: 'room',
          value: {
            categories: [
              {
                id: 'room.type',
                values: ['Hörsal, gradäng'],
              },
            ],
            searchString: null,
            searchFields: null,
          },
          submissionValue: {
            categories: [
              {
                id: 'room.type',
                values: ['Hörsal, gradäng'],
              },
            ],
            searchString: null,
            searchFields: null,
          },
          submissionValueType: 'FILTER',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae69',
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'person_staff',
          value: ['person_auba0002'],
          submissionValue: ['person_auba0002'],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae67',
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'courseevt',
          value: ['courseevt_BI1143-40049-VT2021'],
          submissionValue: ['courseevt_BI1143-40049-VT2021'],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: 'scopedObject',
          elementId: null,
          eventId: null,
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'equipment',
          value: [],
          submissionValue: [],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae6d',
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'activity_teach',
          value: ['course_activity_lecture'],
          submissionValue: ['course_activity_lecture'],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae6b',
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'field',
          extId: 'res.restext',
          value: 'Test2',
          submissionValue: ['Test2'],
          submissionValueType: 'FREE_TEXT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae63',
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
        {
          type: 'field',
          extId: 'res.comment',
          value: '',
          submissionValue: [''],
          submissionValueType: 'FREE_TEXT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '601048afea0edb00206dae62',
          elementId: '601048afea0edb00206dae65',
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          rowIdx: null,
        },
      ],
      sequenceIdx: 1,
    },
  ],
} as { [id: number]: TActivity[] };

const submissions = [
  {
    _id: '601048c0ea0edb00206dae89',
    scopedObject: 'courseevt_BI1143-40049-VT2021',
    status: 'SUBMITTED',
    formId: '60104814ea0edb00206dadfe',
    recipientId: '601048c0ea0edb00206dae87',
    email: 'andreas.kjellqvist+betadryrun@timeedit.com',
    firstName: 'Andreas',
    lastName: 'BetaTest',
    submitter: 'Andreas BetaTest',
    teCoreProps: {
      assignedTo: ['5ff3408cf8fb0700200456e5', '604a15f7c4bfc40020cb8964'],
      acceptanceStatus: 'NOT_SET',
      acceptanceComment: null,
      schedulingProgress: 'SCHEDULING_FINISHED',
      selectionSettings: {
        '601048afea0edb00206dae62': {
          includedFields: [
            {
              fieldExtId: 'res.comment',
              element: '601048afea0edb00206dae65',
            },
          ],
          extraObjects: [[]],
        },
      },
      isStarred: true,
    },
    values: {
      '601048afea0edb00206dae62': {
        'd308a62d-8874-43a6-b127-13ba31aa2f20': {
          eventId: 'd308a62d-8874-43a6-b127-13ba31aa2f20',
          startTime: '2021-02-02T08:00:00.000Z',
          endTime: '2021-02-02T10:15:00.000Z',
          values: [
            {
              elementId: '601048afea0edb00206dae63',
              value: 'Test',
            },
            {
              elementId: '601048afea0edb00206dae65',
              value: 'Testar lite bara på beta',
            },
            {
              elementId: '601048afea0edb00206dae67',
              value: ['person_atsi0001'],
            },
            {
              elementId: '601048afea0edb00206dae69',
              value: [
                {
                  'room.type': ['Datorsal'],
                },
              ],
            },
            {
              elementId: '601048afea0edb00206dae6b',
              value: ['course_activity_discussion'],
            },
            {
              elementId: '601048afea0edb00206dae6d',
              value: [],
            },
          ],
          sectionId: '601048afea0edb00206dae62',
        },
        '9a797766-8a48-40e4-ad0b-c28b516f32ff': {
          eventId: '9a797766-8a48-40e4-ad0b-c28b516f32ff',
          startTime: '2021-02-03T11:00:00.000Z',
          endTime: '2021-02-03T14:00:00.000Z',
          values: [
            {
              elementId: '601048afea0edb00206dae63',
              value: 'Test2',
            },
            {
              elementId: '601048afea0edb00206dae65',
              value: '',
            },
            {
              elementId: '601048afea0edb00206dae67',
              value: ['person_auba0002'],
            },
            {
              elementId: '601048afea0edb00206dae69',
              value: [
                {
                  'room.type': ['Hörsal, gradäng'],
                },
              ],
            },
            {
              elementId: '601048afea0edb00206dae6b',
              value: ['course_activity_lecture'],
            },
            {
              elementId: '601048afea0edb00206dae6d',
              value: [],
            },
          ],
          sectionId: '601048afea0edb00206dae62',
        },
      },
    },
  },
] as TFormInstance[];

// const getObjectData = (objects: ActivityValue[]) => {
//   return objects.map(({ extId, value }) => {
//     const objIds = Array.isArray(value) ? (value as string[]) : null;
//     const objFilter = (value as CategoryField).categories ?? null;
//     return {
//       type: extId,
//       objIds,
//       objFilter,
//     };
//   });
// };

// const getLength = (timing: ActivityValue[]) => {
//   const wrappedTiming = _(timing);
//   const length = wrappedTiming.find(['extId', 'length'])?.value as
//     | number
//     | null;
//   const startTime = wrappedTiming.find(['extId', 'startTime'])?.value as
//     | string
//     | null;
//   const endTime = wrappedTiming.find(['extId', 'endTime'])?.value as
//     | string
//     | null;
//   const duration = moment.duration(moment(endTime).diff(moment(startTime)));

//   return length ?? duration.asMinutes();
// };

// const getValuesForActivity = (
//   activity: TActivity,
//   submission: TFormInstance,
// ) => {
//   const [fields, objects] = _.partition(
//     activity.values,
//     (value) => value.type === 'field',
//   );

//   const objectData = getObjectData(objects);

//   const timingData = activity.timing;

//   const length = getLength(timingData);

//   return {
//     id: activity._id,
//     submitter: submission.recipientId,
//     primaryObject: submission.scopedObject,
//     tag: activity.tagId,
//     fields: fields.map((field) => ({
//       type: field.extId,
//       value: field.value,
//     })),
//     objectData,
//     timing: {
//       length: length,
//       startTime: _(timingData).find(['extId', 'startTime']).value,
//       endTime: _(timingData).find(['extId', 'endTime']).value,
//     },
//   };
// };

// const mergeSimpleData = (currentSubmissionData, newSubmitter, id) => ({
//   ...currentSubmissionData,
//   [newSubmitter]: [...(currentSubmissionData?.[newSubmitter] || []), id],
// });

// const mergeSimpleDataField = (currentData, newData) => (field) => {
//   return mergeSimpleData(currentData[field], newData[field], newData.id);
// };

// const mergeReservationFields = (currentFields, newFields, id) => {
//   const mappedFieldValues = _.keyBy(
//     newFields.map((field) => ({ ...field, id })),
//     'type',
//   );
//   const lol = {
//     ...currentFields,
//     // [newFields.type]: newFields.
//   };
//   return lol;
// };

// type FilterLookUpMap = {
//   submitter: { [submitterId: string]: string[] };
//   tag: { [tagId: string]: string[] };
//   primaryObject: { [primaryObjId: string]: string[] };
//   // fields: { [type: string]: { [value: string]: string[] } };
// };

// const localGetFilterLookupMap = (
//   submissions: { [id: string]: TFormInstance },
//   activities: TActivity[],
// ): FilterLookUpMap => {
//   // Map activities to filter values
//   const filterValues = activities.map((activity) =>
//     getValuesForActivity(activity, submissions[activity.formInstanceId]),
//   );

//   // Merge the filter values into a lookup map
//   const filterLookupMap = filterValues.reduce<FilterLookUpMap>(
//     (mergedFilters, filterValue) => {
//       const curriedMergeSimpleDataOfField = mergeSimpleDataField(
//         mergedFilters,
//         filterValue,
//       );
//       return {
//         ...mergedFilters,
//         submitter: curriedMergeSimpleDataOfField('submitter'),
//         tag: curriedMergeSimpleDataOfField('tag'),
//         primaryObject: curriedMergeSimpleDataOfField('primaryObject'),
//         fields: mergeReservationFields(
//           mergedFilters.fields,
//           filterValue.fields,
//           filterValue.id,
//         ),
//       };
//     },
//     <FilterLookUpMap>{},
//   );
//   return filterLookupMap;
// };
// const submissionMap = _.keyBy(submissions, '_id');
// const result = localGetFilterLookupMap(
//   submissionMap,
//   Object.values(activities).flat(),
// );
describe.skip('testar lite', () => {
  // test('testar', () => {
  //   const submissionMap = _.keyBy(submissions, '_id');
  //   const result = localGetFilterLookupMap(
  //     submissionMap,
  //     Object.values(activities).flat(),
  //   );
  //   console.log({ result });
  // });

  test('almost a real test', () => {
    const expected = {
      submitter: {
        '601048c0ea0edb00206dae87': {
          value: '601048c0ea0edb00206dae87',
          label: 'Submitter A',
          activities: ['6093a60ecdb17300258c7ae4', '6093a60ecdb17300258c7ae5'],
        },
      },
      tag: {
        null: ['6093a60ecdb17300258c7ae4', '6093a60ecdb17300258c7ae5'],
      },
      primaryObject: {
        'courseevt_BI1143-40049-VT2021': [
          '6093a60ecdb17300258c7ae4',
          '6093a60ecdb17300258c7ae5',
        ],
      },
    };

    const submissionMap = _.keyBy(submissions, '_id');
    const res = getFilterLookupMap(
      submissionMap,
      Object.values(activities).flat(),
      [],
    );
    expect(res).not.toBeNull();
    expect(res).toEqual(expected);
  });
});
