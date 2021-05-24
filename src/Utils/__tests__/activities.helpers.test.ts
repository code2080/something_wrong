import { hydrateObjectRequests } from '../activities.helpers';

describe('Activity helpers tests', () => {
  describe('Hydrate object request', () => {
    it('Simple input testing', () => {
      const activity = {
        _id: '60a6748ad2d5b076a79955df',
        formId: '60812e90a46eac0022a5f3d8',
        formInstanceId: '60812ea5a46eac0022a5f407',
        sectionId: '60812ea4a46eac0022a5f3f8',
        eventId: null,
        rowIdx: 'row-0',
        activityStatus: 'FAILED',
        errorDetails: {
          message:
            'teAdmin: Cast to ObjectId failed for value "true" at path "_id" for model "apps"',
          code: 500,
        },
        schedulingTimestamp: '2021-05-21T08:33:41.163Z',
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
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'mode',
            value: 'SEQUENCE',
            submissionValue: ['SEQUENCE'],
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'startTime',
            value: '6081300ca46eac0022a5f434',
            submissionValue: ['6081300ca46eac0022a5f434'],
            submissionValueType: 'OBJECT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fb',
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'endTime',
            value: '60',
            submissionValue: ['60'],
            submissionValueType: 'FREE_TEXT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fd',
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'length',
            value: '60',
            submissionValue: ['60'],
            submissionValueType: 'FREE_TEXT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fd',
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
          },
        ],
        values: [
          {
            type: 'object',
            extId: 'room',
            value: ['6081300ca46eac0022a5f434'],
            submissionValue: ['6081300ca46eac0022a5f434'],
            submissionValueType: 'OBJECT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fb',
            eventId: null,
            rowIdx: 'row-0',
          },
        ],
        sequenceIdx: 0,
      };

      const expected = {
        _id: '60a6748ad2d5b076a79955df',
        formId: '60812e90a46eac0022a5f3d8',
        formInstanceId: '60812ea5a46eac0022a5f407',
        sectionId: '60812ea4a46eac0022a5f3f8',
        eventId: null,
        rowIdx: 'row-0',
        activityStatus: 'FAILED',
        errorDetails: {
          message:
            'teAdmin: Cast to ObjectId failed for value "true" at path "_id" for model "apps"',
          code: 500,
        },
        schedulingTimestamp: '2021-05-21T08:33:41.163Z',
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
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'mode',
            value: 'SEQUENCE',
            submissionValue: ['SEQUENCE'],
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'startTime',
            value: '6081300ca46eac0022a5f434',
            submissionValue: ['6081300ca46eac0022a5f434'],
            submissionValueType: 'OBJECT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fb',
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'endTime',
            value: '60',
            submissionValue: ['60'],
            submissionValueType: 'FREE_TEXT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fd',
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'length',
            value: '60',
            submissionValue: ['60'],
            submissionValueType: 'FREE_TEXT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fd',
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
          },
        ],
        values: [
          {
            type: 'object',
            extId: 'room',
            value: ['room_C-128305'],
            submissionValue: ['6081300ca46eac0022a5f434'],
            submissionValueType: 'OBJECT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fb',
            eventId: null,
            rowIdx: 'row-0',
          },
        ],
        sequenceIdx: 0,
      };

      const objectRequests = [
        {
          _id: '6081300ca46eac0022a5f434',
          organizationId: '5fb6cf79d0330d00203bb3a7',
          formInstanceId: '60812ea5a46eac0022a5f407',
          createdAt: '2021-04-22T08:13:00.897Z',
          updatedAt: '2021-05-19T14:05:13.135Z',
          isActive: true,
          objectRequest: {
            'room.name': 'I want a new room!',
            'room.seats': '100',
            'room.type': '',
            'room.campus': '',
            'room.buildning': '',
            'room.buildning_eng': '',
            'room.city': '',
          },
          datasource: 'room',
          replacementObjectExtId: 'room_C-128305',
          objectExtId: null,
          status: 'replaced',
          type: 'NEW_OBJECT',
        },
      ];
      const hydratedActivity = hydrateObjectRequests(activity, objectRequests);
      expect(hydratedActivity).toEqual(expected);
    });

    it('removes non handled object requests', () => {
      const activity = {
        _id: '60a6748ad2d5b076a79955df',
        formId: '60812e90a46eac0022a5f3d8',
        formInstanceId: '60812ea5a46eac0022a5f407',
        sectionId: '60812ea4a46eac0022a5f3f8',
        eventId: null,
        rowIdx: 'row-0',
        activityStatus: 'FAILED',
        errorDetails: {
          message:
            'teAdmin: Cast to ObjectId failed for value "true" at path "_id" for model "apps"',
          code: 500,
        },
        schedulingTimestamp: '2021-05-21T08:33:41.163Z',
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
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'mode',
            value: 'SEQUENCE',
            submissionValue: ['SEQUENCE'],
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'startTime',
            value: '6081300ca46eac0022a5f434',
            submissionValue: ['6081300ca46eac0022a5f434'],
            submissionValueType: 'OBJECT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fb',
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'endTime',
            value: '60',
            submissionValue: ['60'],
            submissionValueType: 'FREE_TEXT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fd',
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'length',
            value: '60',
            submissionValue: ['60'],
            submissionValueType: 'FREE_TEXT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fd',
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
          },
        ],
        values: [
          {
            type: 'object',
            extId: 'room',
            value: ['6081300ca46eac0022a5f434'],
            submissionValue: ['6081300ca46eac0022a5f434'],
            submissionValueType: 'OBJECT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fb',
            eventId: null,
            rowIdx: 'row-0',
          },
        ],
        sequenceIdx: 0,
      };

      const expected = {
        _id: '60a6748ad2d5b076a79955df',
        formId: '60812e90a46eac0022a5f3d8',
        formInstanceId: '60812ea5a46eac0022a5f407',
        sectionId: '60812ea4a46eac0022a5f3f8',
        eventId: null,
        rowIdx: 'row-0',
        activityStatus: 'FAILED',
        errorDetails: {
          message:
            'teAdmin: Cast to ObjectId failed for value "true" at path "_id" for model "apps"',
          code: 500,
        },
        schedulingTimestamp: '2021-05-21T08:33:41.163Z',
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
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'mode',
            value: 'SEQUENCE',
            submissionValue: ['SEQUENCE'],
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'startTime',
            value: '6081300ca46eac0022a5f434',
            submissionValue: ['6081300ca46eac0022a5f434'],
            submissionValueType: 'OBJECT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fb',
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'endTime',
            value: '60',
            submissionValue: ['60'],
            submissionValueType: 'FREE_TEXT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fd',
            eventId: null,
            rowIdx: 'row-0',
          },
          {
            type: 'timing',
            extId: 'length',
            value: '60',
            submissionValue: ['60'],
            submissionValueType: 'FREE_TEXT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fd',
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
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
            eventId: null,
            rowIdx: 'row-0',
          },
        ],
        values: [
          {
            type: 'object',
            extId: 'room',
            value: [null],
            submissionValue: ['6081300ca46eac0022a5f434'],
            submissionValueType: 'OBJECT',
            valueMode: 'FROM_SUBMISSION',
            sectionId: '60812ea4a46eac0022a5f3f8',
            elementId: '60812ea4a46eac0022a5f3fb',
            eventId: null,
            rowIdx: 'row-0',
          },
        ],
        sequenceIdx: 0,
      };

      const objectRequests = [
        {
          _id: '6081300ca46eac0022a5f434',
          organizationId: '5fb6cf79d0330d00203bb3a7',
          formInstanceId: '60812ea5a46eac0022a5f407',
          createdAt: '2021-04-22T08:13:00.897Z',
          updatedAt: '2021-05-19T14:05:13.135Z',
          isActive: true,
          objectRequest: {
            'room.name': 'I want a new room!',
            'room.seats': '100',
            'room.type': '',
            'room.campus': '',
            'room.buildning': '',
            'room.buildning_eng': '',
            'room.city': '',
          },
          datasource: 'room',
          replacementObjectExtId: null,
          objectExtId: null,
          status: 'replaced',
          type: 'NEW_OBJECT',
        },
      ];
      const hydratedActivity = hydrateObjectRequests(activity, objectRequests);
      expect(hydratedActivity).toEqual(expected);
    });
  });
});
