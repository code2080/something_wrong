const populateWithFieldConstraintTestMocks = {
  activities: [
    {
      _id: '61407bd402a7f70025daaf44',
      formId: '6124dd7db2756100255b39f9',
      formInstanceId: '612d95c0b2756100255b65b2',
      tagId: null,
      sectionId: '6124df17b2756100255b3b1c',
      eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
      rowIdx: null,
      activityStatus: 'FAILED',
      errorDetails: {
        message:
          '-2 / The "user" parameter is not a valid user or does not exist',
        code: -1,
      },
      reservationId: null,
      schedulingTimestamp: '2021-09-17T10:41:56.184Z',
      timing: [
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
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
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
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
          rowIdx: null,
        },
        {
          type: 'timing',
          extId: 'startTime',
          value: '2022-03-03T09:45:00Z',
          submissionValue: ['2022-03-03T09:45:00Z'],
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
          value: '2022-03-03T10:30:00Z',
          submissionValue: ['2022-03-03T10:30:00Z'],
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
          submissionValue: null,
          submissionValueType: null,
          valueMode: null,
          sectionId: null,
          elementId: null,
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
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
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
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
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
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
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
          rowIdx: null,
        },
      ],
      values: [
        {
          type: 'object',
          extId: 'room',
          value: {
            categories: [
              { id: 'room.type', values: ['H??rsal, grad??ng'] },
              { id: 'room.campus', values: ['Ultuna'] },
            ],
            searchString: null,
            searchFields: null,
          },
          submissionValue: {
            categories: [
              { id: 'room.type', values: ['H??rsal, grad??ng'] },
              { id: 'room.campus', values: ['Ultuna'] },
            ],
            searchString: null,
            searchFields: null,
          },
          submissionValueType: 'FILTER',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '6124df17b2756100255b3b1c',
          elementId: '6124df17b2756100255b3b19',
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'equipment',
          value: [
            'equipment_C-KV H??stattrapp 1',
            'equipment_C-KV hund',
            'equipment_C-KV Hyrbil',
            'equipment_C-KV Hyrbuss',
            'equipment_C-KV hund hane',
            'equipment_C-KV H??stattrapp 2',
          ],
          submissionValue: [
            'equipment_C-KV H??stattrapp 1',
            'equipment_C-KV hund',
            'equipment_C-KV Hyrbil',
            'equipment_C-KV Hyrbuss',
            'equipment_C-KV hund hane',
            'equipment_C-KV H??stattrapp 2',
          ],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '6124df17b2756100255b3b1c',
          elementId: '6124df17b2756100255b3b1b',
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'activity_teach',
          value: ['course_activity_test'],
          submissionValue: ['course_activity_test'],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '6124df17b2756100255b3b1c',
          elementId: '6124df17b2756100255b3b1a',
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
          rowIdx: null,
        },
        {
          type: 'object',
          extId: 'person_staff',
          value: ['person_abma'],
          submissionValue: ['person_abma'],
          submissionValueType: 'OBJECT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '6124df17b2756100255b3b1c',
          elementId: '6124df17b2756100255b3b18',
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
          rowIdx: null,
        },
        {
          type: 'field',
          extId: 'res.restext',
          value: 'A4',
          submissionValue: ['A4'],
          submissionValueType: 'FREE_TEXT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '6124df17b2756100255b3b1c',
          elementId: '6124df17b2756100255b3b16',
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
          rowIdx: null,
        },
        {
          type: 'field',
          extId: 'res.comment',
          value: '4',
          submissionValue: ['4'],
          submissionValueType: 'FREE_TEXT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '6124df17b2756100255b3b1c',
          elementId: '6124df17b2756100255b3b17',
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
          rowIdx: null,
        },
        {
          type: 'field',
          extId: 'res.needstechnician',
          value: '100',
          submissionValue: ['100'],
          submissionValueType: 'FREE_TEXT',
          valueMode: 'FROM_SUBMISSION',
          sectionId: '6124df17b2756100255b3b15',
          elementId: '6124df17b2756100255b3b14',
          eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
          rowIdx: null,
        },
      ],
      sequenceIdx: 3,
      organizationId: '5fb6cf79d0330d00203bb3a7',
    },
  ],
  submissions: [
    {
      _id: '612d95c0b2756100255b65b2',
      scopedObject: 'courseevt_SG0260-30288-VT2021',
      status: 'SUBMITTED',
      formId: '6124dd7db2756100255b39f9',
      recipientId: '5d6638a632fbd50020ab1b22',
      email: 'chuong@timeedit.com',
      firstName: 'Chuong',
      lastName: 'Tran',
      submitter: 'Chuong Tran',
      teCoreProps: {
        assignedTo: [],
        acceptanceStatus: 'NOT_SET',
        acceptanceComment: '',
        schedulingProgress: 'IN_PROGRESS',
        selectionSettings: {},
        isStarred: false,
      },
      values: {
        '6124df17b2756100255b3b15': [
          {
            elementId: '6124df17b2756100255b3b14',
            value: 100,
            lastEditedBy: '5d6638a632fbd50020ab1b22',
            lastEditedByName: 'Chuong Tran',
            lastEditedAt: '2021-08-31T02:39:12.844Z',
          },
        ],
        '6124df17b2756100255b3b1c': {
          '3ecd156a-2bfa-4beb-904d-0de14372e820': {
            id: '3ecd156a-2bfa-4beb-904d-0de14372e820',
            sectionId: '6124df17b2756100255b3b1c',
            eventId: '3ecd156a-2bfa-4beb-904d-0de14372e820',
            startTime: '2022-03-03T07:30:00.000Z',
            endTime: '2022-03-03T07:45:00.000Z',
            values: [
              {
                elementId: '6124df17b2756100255b3b16',
                value: 'A1',
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:13.214Z',
              },
              {
                elementId: '6124df17b2756100255b3b17',
                value: 'B1',
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:14.924Z',
              },
              {
                elementId: '6124df17b2756100255b3b18',
                value: ['person_abgu0001'],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:16.042Z',
              },
              {
                elementId: '6124df17b2756100255b3b19',
                value: [{ 'room.type': ['Foaj??/samlingsyta'] }],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:17.993Z',
              },
              {
                elementId: '6124df17b2756100255b3b1a',
                value: ['course_activity_deadline'],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:20.825Z',
              },
              {
                elementId: '6124df17b2756100255b3b1b',
                value: [
                  'equipment_C-Kl??dh??ngare3',
                  'equipment_C-KV hund hane',
                  'equipment_C-KV h??st',
                  'equipment_C-konftel01',
                ],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:27.561Z',
              },
            ],
          },
          '4fcf6366-6ce4-4671-9525-08513a96b4d9': {
            id: '4fcf6366-6ce4-4671-9525-08513a96b4d9',
            sectionId: '6124df17b2756100255b3b1c',
            eventId: '4fcf6366-6ce4-4671-9525-08513a96b4d9',
            startTime: '2022-03-02T07:00:00.000Z',
            endTime: '2022-03-02T08:00:00.000Z',
            values: [
              {
                elementId: '6124df17b2756100255b3b16',
                value: 'A2',
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:42.935Z',
              },
              {
                elementId: '6124df17b2756100255b3b17',
                value: 'B2',
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:43.774Z',
              },
              {
                elementId: '6124df17b2756100255b3b18',
                value: ['person_adke0001'],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:45.127Z',
              },
              {
                elementId: '6124df17b2756100255b3b19',
                value: [{ 'room.type': ['KV, VHC'] }],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:46.913Z',
              },
              {
                elementId: '6124df17b2756100255b3b1a',
                value: ['course_activity_excursion'],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:50.539Z',
              },
              {
                elementId: '6124df17b2756100255b3b1b',
                value: [
                  'equipment_C-KV H??stattrapp 2',
                  'equipment_C-KV H??stattrapp 1',
                  'equipment_C-KV h??st',
                ],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:54.339Z',
              },
            ],
          },
          'c512ae5b-538e-448b-bf20-b9ac644a8964': {
            id: 'c512ae5b-538e-448b-bf20-b9ac644a8964',
            sectionId: '6124df17b2756100255b3b1c',
            eventId: 'c512ae5b-538e-448b-bf20-b9ac644a8964',
            startTime: '2022-03-01T14:00:00.000Z',
            endTime: '2022-03-01T15:00:00.000Z',
            values: [
              {
                elementId: '6124df17b2756100255b3b16',
                value: 'A3',
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:58.316Z',
              },
              {
                elementId: '6124df17b2756100255b3b17',
                value: 'B3',
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:37:59.317Z',
              },
              {
                elementId: '6124df17b2756100255b3b18',
                value: ['person_abma'],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:38:00.187Z',
              },
              {
                elementId: '6124df17b2756100255b3b19',
                value: [{ 'room.type': ['H??rsal, grad??ng'] }],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:38:02.625Z',
              },
              {
                elementId: '6124df17b2756100255b3b1a',
                value: ['course_activity_own_studies'],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:38:05.115Z',
              },
              {
                elementId: '6124df17b2756100255b3b1b',
                value: [
                  'equipment_C-KV hund hane',
                  'equipment_C-KV Hyrbuss',
                  'equipment_C-KV Jerry',
                  'equipment_C-KV H??stattrapp 2',
                  'equipment_C-bb01',
                ],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:38:10.477Z',
              },
            ],
          },
          '59bd9ceb-f64c-46de-920f-5bf169ef496d': {
            id: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
            sectionId: '6124df17b2756100255b3b1c',
            eventId: '59bd9ceb-f64c-46de-920f-5bf169ef496d',
            startTime: '2022-03-03T09:45:00.000Z',
            endTime: '2022-03-03T10:30:00.000Z',
            values: [
              {
                elementId: '6124df17b2756100255b3b16',
                value: 'A4',
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:38:38.108Z',
              },
              {
                elementId: '6124df17b2756100255b3b17',
                value: '4',
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:38:36.474Z',
              },
              {
                elementId: '6124df17b2756100255b3b18',
                value: ['person_abma'],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:38:32.840Z',
              },
              {
                elementId: '6124df17b2756100255b3b19',
                value: [{ 'room.type': ['H??rsal, grad??ng'] }],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:38:46.270Z',
              },
              {
                elementId: '6124df17b2756100255b3b1a',
                value: ['course_activity_test'],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:38:49.186Z',
              },
              {
                elementId: '6124df17b2756100255b3b1b',
                value: [
                  'equipment_C-KV H??stattrapp 1',
                  'equipment_C-KV hund',
                  'equipment_C-KV Hyrbil',
                  'equipment_C-KV Hyrbuss',
                  'equipment_C-KV hund hane',
                  'equipment_C-KV H??stattrapp 2',
                ],
                lastEditedBy: '5d6638a632fbd50020ab1b22',
                lastEditedByName: 'Chuong Tran',
                lastEditedAt: '2021-08-31T02:38:52.527Z',
              },
            ],
          },
        },
      },
      createdAt: '2021-08-31T02:36:48.407Z',
      updatedAt: '2021-09-14T10:40:31.059Z',
      submittedAt: '2021-08-31T02:39:19.199Z',
      index: 1,
    },
    {
      _id: '6124df18b2756100255b3b4e',
      scopedObject: 'courseevt_KE0049-30259-VT2021',
      status: 'SUBMITTED',
      formId: '6124dd7db2756100255b39f9',
      userId: null,
      recipientId: '602d4658d1dac0002011ee52',
      email: 'andreas.kjellqvist@timeedit.com',
      firstName: 'Andreas',
      lastName: 'Kjellqvist',
      submitter: 'Andreas Kjellqvist',
      teCoreProps: {
        assignedTo: [],
        acceptanceStatus: 'NOT_SET',
        acceptanceComment: '',
        schedulingProgress: 'IN_PROGRESS',
        selectionSettings: {},
        isStarred: false,
      },
      values: {
        '6124df17b2756100255b3b15': [
          {
            elementId: '6124df17b2756100255b3b14',
            value: 16,
            lastEditedBy: '602d4658d1dac0002011ee52',
            lastEditedByName: 'Andreas Kjellqvist',
            lastEditedAt: '2021-08-24T12:02:03.261Z',
          },
        ],
        '6124df17b2756100255b3b1c': {
          '54bd4388-b194-49f3-83f5-56b25f3336bb': {
            id: '54bd4388-b194-49f3-83f5-56b25f3336bb',
            sectionId: '6124df17b2756100255b3b1c',
            eventId: '54bd4388-b194-49f3-83f5-56b25f3336bb',
            startTime: '2022-03-01T08:00:00.000Z',
            endTime: '2022-03-01T09:00:00.000Z',
            values: [
              {
                elementId: '6124df17b2756100255b3b16',
                value: 'Test 1',
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:36.461Z',
              },
              {
                elementId: '6124df17b2756100255b3b17',
                value: 'Test 4',
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:45.738Z',
              },
              {
                elementId: '6124df17b2756100255b3b18',
                value: ['person_abgu0001'],
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:13.696Z',
              },
              {
                elementId: '6124df17b2756100255b3b19',
                value: [{ 'room.type': ['Datorsal'] }],
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:18.010Z',
              },
              {
                elementId: '6124df17b2756100255b3b1a',
                value: ['course_activity_digital'],
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:26.823Z',
              },
              {
                elementId: '6124df17b2756100255b3b1b',
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T11:59:47.290Z',
              },
            ],
          },
          'c63bcd9b-1272-4fcf-a714-ad45eb94d4ec': {
            id: 'c63bcd9b-1272-4fcf-a714-ad45eb94d4ec',
            sectionId: '6124df17b2756100255b3b1c',
            eventId: 'c63bcd9b-1272-4fcf-a714-ad45eb94d4ec',
            startTime: '2022-03-01T10:00:00.000Z',
            endTime: '2022-03-01T11:00:00.000Z',
            values: [
              {
                elementId: '6124df17b2756100255b3b16',
                value: 'Test 2',
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:37.762Z',
              },
              {
                elementId: '6124df17b2756100255b3b17',
                value: 'Test 5',
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:48.498Z',
              },
              {
                elementId: '6124df17b2756100255b3b18',
                value: ['person_abgu0001'],
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:13.696Z',
              },
              {
                elementId: '6124df17b2756100255b3b19',
                value: [{ 'room.type': ['Datorsal'] }],
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:18.010Z',
              },
              {
                elementId: '6124df17b2756100255b3b1a',
                value: ['course_activity_digital'],
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:26.823Z',
              },
              {
                elementId: '6124df17b2756100255b3b1b',
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T11:59:58.626Z',
              },
            ],
          },
          '1447d20d-9dc2-4130-8f60-d6400a9d8ebf': {
            id: '1447d20d-9dc2-4130-8f60-d6400a9d8ebf',
            sectionId: '6124df17b2756100255b3b1c',
            eventId: '1447d20d-9dc2-4130-8f60-d6400a9d8ebf',
            startTime: '2022-03-02T09:00:00.000Z',
            endTime: '2022-03-02T10:00:00.000Z',
            values: [
              {
                elementId: '6124df17b2756100255b3b16',
                value: 'Test 3',
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:38.869Z',
              },
              {
                elementId: '6124df17b2756100255b3b17',
                value: 'Test 6',
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:50.482Z',
              },
              {
                elementId: '6124df17b2756100255b3b18',
                value: ['person_abgu0001'],
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:13.696Z',
              },
              {
                elementId: '6124df17b2756100255b3b19',
                value: [{ 'room.type': ['Labbsal'] }],
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:01:17.644Z',
              },
              {
                elementId: '6124df17b2756100255b3b1a',
                value: ['course_activity_digital'],
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:26.823Z',
              },
              {
                elementId: '6124df17b2756100255b3b1b',
                lastEditedBy: '602d4658d1dac0002011ee52',
                lastEditedByName: 'Andreas Kjellqvist',
                lastEditedAt: '2021-08-24T12:00:04.935Z',
              },
            ],
          },
        },
      },
      createdAt: '2021-08-24T11:59:20.103Z',
      updatedAt: '2021-08-24T22:15:25.703Z',
      submittedAt: '2021-08-24T12:02:17.683Z',
      index: 0,
    },
  ],
  constraintConfiguration: {
    _id: '61266bad68881119c436f1df',
    formId: '6124dd7db2756100255b39f9',
    name: 'Testing parameterized constraints',
    description: ' ',
    constraints: [
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1e0',
        constraintId: 'ensurePhysicalObjectsNotDoubleBooked',
        isActive: true,
        isHardConstraint: true,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1e1',
        constraintId: 'objectCollisionConflict',
        isActive: true,
        isHardConstraint: true,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1e2',
        constraintId: 'shouldOnlyBeNullIfNoMatchedObjects',
        isActive: true,
        isHardConstraint: true,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1e3',
        constraintId: 'dontDoubleBookPlanningObjects',
        isActive: true,
        isHardConstraint: true,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1e4',
        constraintId: 'ensureNoMutualPhysicalObjectsAtSameTime',
        isActive: true,
        isHardConstraint: true,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1e5',
        constraintId: 'shouldMatchDateRanges',
        isActive: true,
        isHardConstraint: false,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1e6',
        constraintId: 'shouldMatchWeekday',
        isActive: true,
        isHardConstraint: false,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1e7',
        constraintId: 'shouldMatchExactTimes',
        isActive: true,
        isHardConstraint: false,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1e8',
        constraintId: 'shouldRespectPaddingBeforeInSequenceOrder',
        isActive: true,
        isHardConstraint: false,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1e9',
        constraintId: 'shouldRespectPaddingAfterInSequenceOrder',
        isActive: true,
        isHardConstraint: false,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [{}],
        _id: '61266bad68881119c436f1ea',
        constraintId: 'shouldMatchSequenceOrder',
        isActive: true,
        isHardConstraint: false,
        weight: 10,
        operator: '>',
      },
      {
        parameters: [
          {
            firstParam: [
              'Form',
              '6124df17b2756100255b3b15',
              '6124df17b2756100255b3b14',
            ],
            lastParam: ['Objects', 'room', 'room.seats'],
          },
        ],
        _id: '61266bad68881119c436f1eb',
        constraintId: 'shouldMatchFieldValues',
        isActive: false,
        isHardConstraint: true,
        weight: 10,
        operator: '<',
      },
    ],
  },
};

export default populateWithFieldConstraintTestMocks;
