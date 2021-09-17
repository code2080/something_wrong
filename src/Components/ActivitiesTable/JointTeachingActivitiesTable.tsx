import React, { useMemo, ReactChild, useState, Key } from 'react';
import { chain, compact, isEmpty, keyBy, uniq } from 'lodash';

// COMPONENTS
import ActivityTable from 'Pages/FormDetail/pages/ActivityTable';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popconfirm } from 'antd';

// TYPES
import { TActivity } from 'Types/Activity.type';
import { useSelector } from 'react-redux';

// SELECTORS
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import { ActivityValue } from 'Types/ActivityValue.type';
import { calculateActivityConflicts } from 'Utils/activities.helpers';

import './JointTeachingActivitiesTable.scss';
import AddActivitiesToJointTeachingGroupModal from 'Pages/FormDetail/pages/JointTeaching/JointTeachingModals/AddActivitiesToJointTeachingGroupModal';
import { selectUnmatchedActivities } from 'Redux/GlobalUI/globalUI.selectors';

interface Props {
  formId: string;
  activities: TActivity[];
  readonly?: boolean;
  showResult?: boolean;
  onRemove?: (activityId: string) => void;
  onAddActivity?: (activityIds: Key[]) => void;
  footer?: ReactChild;
  header?: ReactChild;
  selectedActivities?: Key[];
  onSelect?(selectedRowKeys: Key[]): void;
}
interface TableProps extends Omit<Props, ''> {
  allElementIds: string[];
}

const JointTeachingActivitiesTable = (props: TableProps) => {
  const [selectedJointTeachingValue, setSelectedJointTeachingValue] = useState(
    {},
  );
  const [addActivityModalVisible, setAddActivityModalVisible] = useState(false);
  const {
    activities,
    formId,
    readonly,
    onRemove,
    onAddActivity,
    footer,
    header,
    selectedActivities,
    onSelect,
    showResult,
    allElementIds,
  } = props;
  const unmatchedActivities = useSelector(selectUnmatchedActivities(formId));
  const design = useSelector(selectDesignForForm)(formId);
  const submissions = useSelector((state) =>
    makeSelectSubmissions()(state, formId),
  );

  const indexedSubmissions = useMemo(() => {
    return keyBy(submissions, '_id');
  }, [submissions]);

  const resultsRow = useMemo(() => {
    if (!showResult) return null;
    const formInstanceIds = uniq(
      activities.map(({ formInstanceId }) => formInstanceId),
    );
    const firstActivity = activities[0];
    const mergedElementValues = calculateActivityConflicts(
      activities,
      allElementIds,
      selectedJointTeachingValue,
    );
    if (!firstActivity) return null;
    return {
      ...firstActivity,
      values: firstActivity.values.map(
        (actValue) => mergedElementValues[actValue?.elementId as string] || {},
      ),
      submitters: chain(formInstanceIds)
        .map((formInstanceId) => indexedSubmissions[formInstanceId]?.submitter)
        .uniq()
        .join(', ')
        .value(),
      isInactive: () => false,
      sequenceIdx: -1,
    };
  }, [
    showResult,
    activities,
    allElementIds,
    selectedJointTeachingValue,
    indexedSubmissions,
  ]);

  const finalActivities = compact([...activities, resultsRow]);

  return (
    <div>
      {header}
      <ActivityTable
        className={`joint-teaching-activities-table ${
          readonly ? 'readonly' : ''
        }`}
        design={design}
        activities={finalActivities}
        columnPrefix={
          !readonly
            ? (activity: TActivity, activityValue: ActivityValue) => {
                if (!activity || Number(activity?.sequenceIdx) < 0) return null;
                if (
                  activityValue?.elementId &&
                  (allElementIds || []).includes(activityValue.elementId)
                ) {
                  return (
                    <Checkbox
                      checked={
                        selectedJointTeachingValue[activityValue.elementId] ===
                        activity._id
                      }
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedJointTeachingValue({
                            ...selectedJointTeachingValue,
                            [activityValue.elementId as string]: activity._id,
                          });
                      }}
                    />
                  );
                }
                return null;
              }
            : undefined
        }
        renderer={(activity, values) => {
          if (activity.sequenceIdx < 0 && isEmpty(values[0]?.value)) {
            return <span className='text--error'>N/A</span>;
          }
          return undefined;
        }}
        additionalColumns={{
          pre: compact([
            {
              width: 100,
              title: 'Activity',
              key: 'index',
              dataIndex: 'index',
              className: 'cell--activity-index',
              render: (_, __, rowIndex: number) => {
                if (!showResult) return `Activity ${1 + rowIndex}`;
                if (rowIndex === finalActivities.length - 1) return 'Result';
                return `Activity ${1 + rowIndex}`;
              },
            },
            {
              title: 'Joint teaching object',
              key: 'jointTeachingObject',
              width: 250,
              render: (act: TActivity) => act.jointTeaching?.object,
            },
            {
              title: 'Submitter',
              key: 'submitter',
              width: 150,
              render: (activity) => {
                if (activity?.submitters) return activity.submitters;
                return indexedSubmissions[activity.formInstanceId]?.submitter;
              },
            },
          ]),
          post: compact([
            typeof onRemove === 'function' && {
              title: 'Actions',
              width: 120,
              align: 'center',
              render: (activity: TActivity) => {
                if (Number(activity.sequenceIdx) < 0) {
                  return (
                    <Button
                      size='small'
                      onClick={() => setAddActivityModalVisible(true)}
                    >
                      Add more
                    </Button>
                  );
                }
                return (
                  <Popconfirm
                    title='Are you sure you want to delete this activity from group?'
                    onConfirm={() => onRemove(activity._id)}
                  >
                    <Button type='link' icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                );
              },
            },
          ]),
        }}
        footer={footer ? () => footer : undefined}
        pagination={false}
        selectedActivities={selectedActivities}
        onSelect={onSelect}
      />
      <AddActivitiesToJointTeachingGroupModal
        formId={formId}
        visible={addActivityModalVisible}
        onCancel={() => setAddActivityModalVisible(false)}
        activities={unmatchedActivities}
        onSubmit={onAddActivity}
      />
    </div>
  );
};

const TableWrapper = (props: Props) => {
  const { activities } = props;
  // TODO: Need to support `scopedObjects`, `templates` and `group`
  const allElementIds: string[] = useMemo(
    () =>
      chain((activities[0]?.values || []).map((val) => val.elementId))
        .compact()
        .uniq()
        .value(),
    [activities],
  );
  if (isEmpty(activities)) return null;
  return (
    <JointTeachingActivitiesTable {...props} allElementIds={allElementIds} />
  );
};

export default TableWrapper;
