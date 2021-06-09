import _, { compact, partition } from 'lodash';
import { ActivityValue, CategoryField } from '../ActivityValue.type';
import { TActivity } from '../../Types/Activity.type';
import { TFormInstance } from '../../Types/FormInstance.type';
import { getFilterLookupMap } from '../../Utils/activities.helpers';
import { TFilterLookUpMap } from '../FilterLookUp.type';

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

const mergeReservationFields = (currentValues, newFields, activityId) => {
  const returnObj = newFields
    ?.filter(({ value }) => !!value)
    ?.reduce((acc, field) => {
      return {
        ...acc,
        [field?.extId]: {
          ...(acc[field?.extId] ?? {}),
          [field?.value]: [
            ...(acc?.[field?.extId]?.[field?.value] ?? []),
            activityId,
          ],
        },
      };
    }, currentValues);
  return returnObj ?? {};
};

const mergeObjectFilterId = (
  currentValues,
  newObj,
  activityId,
): { objects; objectFilters } => {
  const returnObj = newObj?.reduce(
    (val, obj) => ({
      ...val,

      [obj?.type]: {
        ...(val[obj?.type] ?? {}),
        ...obj.objFilter.reduce(
          (acc, objFilt) => ({
            ...acc,
            [objFilt.id]: {
              ...(acc[objFilt.id] || {}),
              ...objFilt.values.reduce(
                (accu, valu) => ({
                  ...accu,
                  [valu]: [...(accu[valu] || []), activityId],
                }),
                {},
              ),
            },
          }),
          {},
        ),
      },
    }),
    currentValues,
  );
  return returnObj ?? {};
};

const mergeObjectsId = (
  currentValues,
  nextObjects,
  activityId,
): { objects; objectFilters } => {
  const returnObj = nextObjects?.reduce(
    (val, obj) => ({
      ...val,
      [obj.type]: {
        ...val[obj.type],
        [obj.id]: [...(val?.[obj.type]?.[obj.id] ?? []), activityId],
        ...(val.objects ?? {}),
      },
    }),
    currentValues,
  );

  return returnObj ?? {};
};

const mergeSimpleData = (currentSubmissionData, newSubmitter, id: string) => ({
  ...currentSubmissionData,
  [newSubmitter.id]: [...(currentSubmissionData?.[newSubmitter.id] || []), id],
});

const mergeSimpleDataField = (currentData, newData) => (
  field: 'tag' | 'submitter' | 'primaryObject' | 'objects',
) => mergeSimpleData(currentData[field], newData[field], newData.id);

const getObjectData = (objects: ActivityValue[]) =>
  objects.map(({ extId, value }) => {
    const objIds = Array.isArray(value) ? (value as string[]) : null;
    const objFilter = (value as CategoryField).categories ?? null;
    return {
      type: extId,
      objIds,
      objFilter,
    };
  });

const getValuesForActivity = (
  activity: TActivity,
  submission: TFormInstance,
 
) => {
  const [fields, objects] = partition(
    activity.values,
    (value) => value.type === 'field',
  );

  const objectData = getObjectData(objects);

  return activity && submission
    ? {
        id: activity._id,
        submitter: {
          id: submission.recipientId,
        },
        primaryObject: { id: submission.scopedObject },
        objects: objectData
          .filter(({ objIds }) => objIds)
          .flatMap(({ objIds, type }) =>
            objIds?.flatMap((id: string) => ({ type, id })),
          ),
        objectFilters: objectData.filter(({ objFilter }) => objFilter),
        tag: {
          id: activity.tagId,
        },
        fields,
      }
    : null;
};

const localGetFilterLookupMap = ({
  activities,
  submissions,
 
}: {
  activities: TActivity[];
  submissions: { [submissionId: string]: TFormInstance };
  
}) => {
  // Map activities to filter values
  const filterValues = compact(
    activities.map((activity) =>
      getValuesForActivity(
        activity,
        submissions[activity.formInstanceId],
      
      ),
    ),
  );

  // Merge the filter values into a lookup map
  return filterValues.reduce<TFilterLookUpMap>((mergedFilters, filterValue) => {
    const curriedMergeSimpleDataOfField = mergeSimpleDataField(
      mergedFilters,
      filterValue,
    );

    return {
      ...mergedFilters,
      submitter: curriedMergeSimpleDataOfField('submitter'),
      primaryObject: curriedMergeSimpleDataOfField('primaryObject'),
      tag: curriedMergeSimpleDataOfField('tag'),
      objects: mergeObjectsId(
        mergedFilters.objects ?? {},
        filterValue.objects,
        filterValue.id,
      ),
      objectFilters: mergeObjectFilterId(
        mergedFilters.objectFilters ?? {},
        filterValue.objectFilters,
        filterValue,
      ),
      fields: mergeReservationFields(
        mergedFilters.fields ?? {},
        filterValue.fields,
        filterValue.id,
      ),
    };
  }, <TFilterLookUpMap>{});
};


const submissionMap = _.keyBy(submissions, '_id');
const result = localGetFilterLookupMap(
  {
    submissions: submissionMap, activities:
    Object.values(activities).flat(),
  }
);

console.log({ result });
describe.skip('testar lite', () => {
  test('testar', () => {
    const submissionMap = _.keyBy(submissions, '_id');
    const result = localGetFilterLookupMap(
      {
        submissions: submissionMap, activities:
        Object.values(activities).flat(),
      }
    );
    console.log({ result });
  });

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
