import JointTeachingIcon from '../JointTeachingIcon';
import mockStore from '../../../../../Mock/MockState';
import configureStore from '../../../../../Redux/store';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TActivity } from 'Types/Activity.type';

const fakeActivity = {
  _id: '60912a9e7a86fc2c90563901',
  formId: '5fbe13cddb07580020e2bdbf',
  formInstanceId: '5fdb2e82596fd700208c0e68',
  tagId: null,
  sectionId: '5fbe19c4db07580020e2bfaf',
  eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'timing',
      extId: 'startTime',
      value: '2020-11-26T09:30:00Z',
      submissionValue: ['2020-11-26T09:30:00Z'],
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
      value: '2020-11-26T14:15:00Z',
      submissionValue: ['2020-11-26T14:15:00Z'],
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
      value: '2020-11-26T09:30:00Z',
      submissionValue: ['2020-11-26T09:30:00Z'],
      submissionValueType: 'TIMING',
      valueMode: 'FROM_SUBMISSION',
      sectionId: null,
      elementId: null,
      eventId: null,
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
  ],
  values: [
    {
      type: 'object',
      extId: 'room',
      value: {
        categories: [
          { id: 'room.buildning', values: ['Ulls hus A-blocket'] },
          { id: 'room.type', values: ['Datorsal'] },
        ],
        searchString: null,
        searchFields: null,
      },
      submissionValue: {
        categories: [
          { id: 'room.buildning', values: ['Ulls hus A-blocket'] },
          { id: 'room.type', values: ['Datorsal'] },
        ],
        searchString: null,
        searchFields: null,
      },
      submissionValueType: 'FILTER',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfb2',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'object',
      extId: 'person_staff',
      value: ['person_atsi0001'],
      submissionValue: ['person_atsi0001'],
      submissionValueType: 'OBJECT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfb6',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'object',
      extId: 'equipment',
      value: ['equipment_C-Klädhängare3'],
      submissionValue: ['equipment_C-Klädhängare3'],
      submissionValueType: 'OBJECT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfb8',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'object',
      extId: 'courseevt',
      value: ['courseevt_BI1301-20016-HT2020'],
      submissionValue: ['courseevt_BI1301-20016-HT2020'],
      submissionValueType: 'OBJECT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: 'scopedObject',
      elementId: null,
      eventId: null,
      rowIdx: null,
    },
    {
      type: 'object',
      extId: 'activity_teach',
      value: ['other_duties_course_tracks'],
      submissionValue: ['other_duties_course_tracks'],
      submissionValueType: 'OBJECT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfb4',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'field',
      extId: 'res.comment',
      value: 'b',
      submissionValue: ['b'],
      submissionValueType: 'FREE_TEXT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfbc',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'field',
      extId: 'res.internalcomment',
      value: 'a',
      submissionValue: ['a'],
      submissionValueType: 'FREE_TEXT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfba',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'field',
      extId: 'res.restext',
      value: 'Test',
      submissionValue: ['Test'],
      submissionValueType: 'FREE_TEXT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfb0',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
  ],
  sequenceIdx: 0,
};

const fakeActivityWithMerged = {
  _id: '60912a9e7a86fc2c90563901',
  formId: '5fbe13cddb07580020e2bdbf',
  formInstanceId: '5fdb2e82596fd700208c0e68',
  tagId: null,
  sectionId: '5fbe19c4db07580020e2bfaf',
  eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'timing',
      extId: 'startTime',
      value: '2020-11-26T09:30:00Z',
      submissionValue: ['2020-11-26T09:30:00Z'],
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
      value: '2020-11-26T14:15:00Z',
      submissionValue: ['2020-11-26T14:15:00Z'],
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
      value: '2020-11-26T09:30:00Z',
      submissionValue: ['2020-11-26T09:30:00Z'],
      submissionValueType: 'TIMING',
      valueMode: 'FROM_SUBMISSION',
      sectionId: null,
      elementId: null,
      eventId: null,
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
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
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
  ],
  values: [
    {
      type: 'object',
      extId: 'room',
      value: {
        categories: [
          { id: 'room.buildning', values: ['Ulls hus A-blocket'] },
          { id: 'room.type', values: ['Datorsal'] },
        ],
        searchString: null,
        searchFields: null,
      },
      submissionValue: {
        categories: [
          { id: 'room.buildning', values: ['Ulls hus A-blocket'] },
          { id: 'room.type', values: ['Datorsal'] },
        ],
        searchString: null,
        searchFields: null,
      },
      submissionValueType: 'FILTER',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfb2',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'object',
      extId: 'person_staff',
      value: ['person_atsi0001'],
      submissionValue: ['person_atsi0001'],
      submissionValueType: 'OBJECT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfb6',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'object',
      extId: 'equipment',
      value: ['equipment_C-Klädhängare3'],
      submissionValue: ['equipment_C-Klädhängare3'],
      submissionValueType: 'OBJECT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfb8',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'object',
      extId: 'courseevt',
      value: ['courseevt_BI1301-20016-HT2020'],
      submissionValue: ['courseevt_BI1301-20016-HT2020'],
      submissionValueType: 'OBJECT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: 'scopedObject',
      elementId: null,
      eventId: null,
      rowIdx: null,
    },
    {
      type: 'object',
      extId: 'activity_teach',
      value: ['other_duties_course_tracks'],
      submissionValue: ['other_duties_course_tracks'],
      submissionValueType: 'OBJECT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfb4',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'field',
      extId: 'res.comment',
      value: 'b',
      submissionValue: ['b'],
      submissionValueType: 'FREE_TEXT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfbc',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'field',
      extId: 'res.internalcomment',
      value: 'a',
      submissionValue: ['a'],
      submissionValueType: 'FREE_TEXT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfba',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
    {
      type: 'field',
      extId: 'res.restext',
      value: 'Test',
      submissionValue: ['Test'],
      submissionValueType: 'FREE_TEXT',
      valueMode: 'FROM_SUBMISSION',
      sectionId: '5fbe19c4db07580020e2bfaf',
      elementId: '5fbe19c4db07580020e2bfb0',
      eventId: 'c2ad8eed-1c49-47ed-bbc4-b4a8c663847a',
      rowIdx: null,
    },
  ],
  sequenceIdx: 0,
  originJointTeachingGroup: 'jointTeachingGroupId',
};

const store = configureStore(mockStore);

describe('JointTeachingIcon test', () => {
  describe('Render unmerged joint teaching icon', () => {
    beforeEach(() =>
      render(
        <Provider store={store}>
          <JointTeachingIcon activity={fakeActivity as TActivity} />
        </Provider>,
      ),
    );

    it('Renders without error', () => {
      render(
        <Provider store={store}>
          <JointTeachingIcon activity={fakeActivity as TActivity} />,
        </Provider>,
      );
    });

    it('Returns null if no activity', () => {
      const { container } = render(
        <Provider store={store}>
          <JointTeachingIcon activity={undefined} />
        </Provider>,
      );

      expect(container.innerHTML).toBe('');
    });

    it('Test rendering of default joint teaching icon', () => {
      expect(screen.getByRole('button'));
    });

    it('Test hovering on joint teaching icon', () => {
      fireEvent.mouseOver(screen.getByRole('button'));
      waitFor(() =>
        expect(
          screen.getByText('Click to indicate joint teaching'),
        ).toBeInTheDocument(),
      );
    });

    it('Test clicking on joint teaching icon', () => {
      fireEvent.click(screen.getByRole('button'));
      expect(
        screen.getByText('Select joint teaching object'),
      ).toBeInTheDocument();
    });
  });

  describe('Rendering icon with merge activities', () => {
    beforeEach(() =>
      render(
        <Provider store={store}>
          <JointTeachingIcon activity={fakeActivityWithMerged as TActivity} />
        </Provider>,
      ),
    );
    it('Renders without error', () => {
      render(
        <Provider store={store}>
          <JointTeachingIcon activity={fakeActivityWithMerged as TActivity} />
        </Provider>,
      );
    });
    it('Test rendering merged icon', () => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Test editing of activities', () => {
    it('Set joint teaching object and reset it', () => {
      const { getByRole } = render(
        <Provider store={store}>
          <JointTeachingIcon activity={fakeActivity as TActivity} />
        </Provider>,
      );

      fireEvent.click(getByRole('button'));
      expect(getByRole('combobox')).toHaveValue('');
      fireEvent.change(getByRole('combobox'), {
        target: { value: 'Test' },
      });
      expect(getByRole('combobox')).toHaveValue('Test');
      const delButton = screen.getByRole('button', { name: 'delete' });
      expect(delButton).toBeInTheDocument();
    });
  });
});
