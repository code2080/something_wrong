import React, { useMemo, ReactChild, useState, Key, useEffect } from 'react';
import { chain, compact, isEmpty, keyBy, uniq } from 'lodash';

// COMPONENTS
import ActivityTable from '../../Pages/FormDetail/pages/ActivityTable';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popconfirm } from 'antd';

// TYPES
import { TActivity } from '../../Types/Activity.type';
import { useSelector } from 'react-redux';

// SELECTORS
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import {
  calculateActivityConflicts,
  getUniqueValues,
} from 'Utils/activities.helpers';

import './JointTeachingActivitiesTable.scss';
import AddActivitiesToJointTeachingGroupModal from '../../Pages/FormDetail/pages/JointTeaching/JointTeachingModals/AddActivitiesToJointTeachingGroupModal';
import { selectActivitiesForForm } from '../../Redux/Activities/activities.selectors';
import { UNMATCHED_ACTIVITIES_TABLE } from '../../Constants/tables.constants';

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
  const [selectedJointTeachingValue, setSelectedJointTeachingValue] = useState<
    number[]
  >([]);
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
  const unmatchedActivities = useSelector(
    selectActivitiesForForm({ formId, tableType: UNMATCHED_ACTIVITIES_TABLE }),
  );
  const design = useSelector(selectDesignForForm)(formId);
  const submissions = useSelector((state) =>
    makeSelectSubmissions()(state, formId),
  );

  const uniqueValues = useMemo(() => {
    return getUniqueValues(activities);
  }, [activities]);
  console.log('uniqueValues', uniqueValues);

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
      selectedJointTeachingValue,
    );
    if (!firstActivity) return null;
    return {
      ...firstActivity,
      values: mergedElementValues,
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

  useEffect(() => {
    if (activities[0]) {
      setSelectedJointTeachingValue(activities[0].values.map(() => -1));
    }
  }, [activities.length]);

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
            ? ([activity, activityIndex], [, activityValueIdx]) => {
                if (!activity || Number(activity?.sequenceIdx) < 0) return null;
                if (uniqueValues[activityValueIdx].length > 1) {
                  return (
                    <Checkbox
                      checked={
                        selectedJointTeachingValue[activityValueIdx] ===
                        activityIndex
                      }
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedJointTeachingValue([
                            ...selectedJointTeachingValue.slice(
                              0,
                              activityValueIdx,
                            ),
                            activityIndex,
                            ...selectedJointTeachingValue.slice(
                              activityValueIdx + 1,
                            ),
                          ]);
                      }}
                    />
                  );
                }
                // return null;
              }
            : undefined
        }
        renderer={(activity, values) => {
          if (activity.sequenceIdx < 0 && isEmpty(values)) {
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
