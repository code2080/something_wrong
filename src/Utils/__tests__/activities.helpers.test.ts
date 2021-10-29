import {
  hydrateObjectRequests,
  populateWithFieldConstraint,
  getUniqueValues,
  getAllValuesFromActivities,
  calculateActivityConflictsByType,
} from '../activities.helpers';
import populateWithFieldConstraintMock from '../__mock__/activities.helpers.mock';
import { dummyJointTeachingActivities } from 'Mock/Activities';
import { ConflictType } from 'Models/JointTeachingGroup.model';
import { cloneDeep } from 'lodash';

describe('Activity helpers tests', () => {
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

  describe('Hydrate object request', () => {
    it('Simple input testing', () => {
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
      const hydratedActivity = hydrateObjectRequests(
        activity as any,
        objectRequests as any[],
      );
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
            value: [],
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
      const hydratedActivity = hydrateObjectRequests(
        activity as any,
        objectRequests as any[],
      );
      expect(hydratedActivity).toEqual(expected);
    });
  });
  describe('populateWithFieldConstraint tests', () => {
    it('returns activities if no constraint configuration is provided', () => {
      const activities = [];
      const retVal = populateWithFieldConstraint({
        activities,
        constraintConfiguration: null,
      });
      expect(retVal).toEqual(activities);
    });

    it('should add field data to activity', () => {
      const fieldConstraint = {
        value: 100,
        operator: '<',
        objectField: { typeExtId: 'room', fieldExtId: 'room.seats' },
      };
      const expected = {
        ...populateWithFieldConstraintMock.activities[0],
        fieldConstraint,
      };
      const returnedActivity = populateWithFieldConstraint(
        populateWithFieldConstraintMock as any,
      );
      expect([expected]).toEqual(returnedActivity);
    });
  });

  describe('Activities in joint teaching', () => {
    it('Should return all unique activity values', () => {
      const activities = cloneDeep(dummyJointTeachingActivities);
      const allTiming = getAllValuesFromActivities('timing', activities);
      const allValues = getAllValuesFromActivities('values', activities);
      expect(allTiming).toBeTruthy();
      expect(allTiming.length).toHaveLength(2);
      expect(allTiming.startDate).toBeNull();

      expect(allValues).toBeTruthy();
      expect(allValues.accinfo).toHaveLength(3);
      expect(allValues.user_iac).toHaveLength(3);

      const idx = activities[0].values.findIndex(
        (val) => val.extId === 'accinfo',
      );
      activities[0].values[idx].value = ['hasBeenChanged'];

      const idx2 = activities[1].values.findIndex(
        (val) =>
          val.extId === 'user_iac' && val.value && val.value[0] === '_te_2473',
      );
      activities[1].values[idx2].value = ['_te_2469'];

      const allValues2 = getAllValuesFromActivities('values', activities);
      expect(allValues2.accinfo).toHaveLength(4);
      expect(allValues2.user_iac).toHaveLength(2);
    });

    it('Should return list of activity values indexed by ConflictStatus and extId', () => {
      const activities = cloneDeep(dummyJointTeachingActivities);
      const uniqueValues = getUniqueValues(activities);
      expect(uniqueValues).toBeTruthy();
      expect(uniqueValues.timing.length).toHaveLength(2);
      expect(uniqueValues.values.eventtype).toHaveLength(1);
      expect(uniqueValues.values.headcount).toHaveLength(2);
      expect(uniqueValues.values.evt_option).toHaveLength(3);

      activities[0].values[0].value = ['hasBeenChanged'];
      const uniqueValues2 = getUniqueValues(activities);
      expect(uniqueValues2).toBeTruthy();
      expect(uniqueValues2.values.eventtype).toHaveLength(2);
    });

    it('Calculate activities conflicts', () => {
      const conflicts = calculateActivityConflictsByType(
        ConflictType.VALUES,
        dummyJointTeachingActivities,
        {
          values: {
            eventtype: ['_te_2480', 'anotherValue'],
            evt_option: ['_te_2470', '_te_2472', '_te_2471'],
          },
        },
      );
      expect(conflicts.eventtype).toHaveLength(1);
      expect(conflicts.evt_option).toHaveLength(3);
    });
  });
});
