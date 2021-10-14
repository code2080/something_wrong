import React, { useMemo, ReactChild, useState, Key, useEffect } from 'react';
import _, { chain, compact, isEmpty, isEqual, keyBy, uniq } from 'lodash';

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
import { ActivityValue } from 'Types/ActivityValue.type';
import {
  ConflictType,
  JointTeachingConflictMapping,
} from 'Models/JointTeachingGroup.model';
import ObjectLabel from 'Components/ObjectLabel/ObjectLabel';

interface Props {
  formId: string;
  activities: TActivity[];
  readonly?: boolean;
  showResult?: boolean;
  onRemove?: (activityId: string) => void;
  onAddActivity?: (activityIds: Key[]) => void;
  onSelectValue?: (
    type: ConflictType,
    checked: boolean,
    activityValue: ActivityValue,
  ) => void;
  footer?: ReactChild;
  header?: ReactChild;
  selectedActivities?: Key[];
  jointTeachingGroupId?: string;
  onSelect?(selectedRowKeys: Key[]): void;
  conflicts?: JointTeachingConflictMapping;
  loading?: boolean;
}
interface TableProps extends Omit<Props, ''> {
  allElementIds: string[];
}
interface TActivityResult extends TActivity {
  jointTeachings: Array<{ object: string; typeExtId: string }>;
  scopedObjects: string[];
}

const JointTeachingActivitiesTable = (props: TableProps) => {
  const [selectedJointTeachingValue, setSelectedJointTeachingValue] = useState<{
    [type: string]: { [key: string]: string };
  }>({
    [ConflictType.VALUES]: {},
    [ConflictType.TIMING]: {},
  });

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
    onSelectValue,
    conflicts,
    loading,
    jointTeachingGroupId,
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

  const indexedSubmissions = useMemo(() => {
    return keyBy(submissions, '_id');
  }, [submissions]);

  const resultsRow = useMemo(() => {
    if (!showResult) return null;
    const formInstanceIds = uniq(
      activities.map(({ formInstanceId }) => formInstanceId),
    );
    const firstActivity = activities[0];
    const { values: mergedActivityValues, timing: mergedActivityTiming } =
      calculateActivityConflicts(activities, selectedJointTeachingValue);

    if (!firstActivity) return null;

    return {
      ...firstActivity,
      timing: firstActivity.timing.map((val) => {
        return (
          mergedActivityTiming[val.extId] || {
            ...val,
            value: null,
          }
        );
      }),
      values: firstActivity.values.map((val) => {
        return mergedActivityValues[val.extId] || [];
      }),
      submitters: chain(formInstanceIds)
        .map((formInstanceId) => indexedSubmissions[formInstanceId]?.submitter)
        .uniq()
        .join(', ')
        .value(),
      isInactive: () => false,
      sequenceIdx: -1,
      jointTeachings: _(activities)
        .filter((act) => !!act.jointTeaching?.object)
        .map('jointTeaching')
        .uniqWith((jT1, jT2) => jT1?.object === jT2?.object)
        .value(),
      scopedObjects: _(activities)
        .filter((act) => !!act.scopedObject)
        .map((act) => act.scopedObject)
        .uniq()
        .value(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showResult,
    activities,
    allElementIds,
    indexedSubmissions,
    selectedJointTeachingValue,
  ]);
  const finalActivities = compact([...activities, resultsRow]);

  useEffect(() => {
    if (!conflicts) return;
    const selectedValues = {};
    Object.keys(conflicts).forEach((type) => {
      selectedValues[type] = {};
      const typeValues = conflicts[type];
      Object.keys(typeValues).forEach((extId) => {
        const val = typeValues[extId];
        const foundActivity = activities.find((act) => {
          return act[type].find((values) =>
            isEqual(
              Array.isArray(values.value) ? values.value : [values.value],
              val.resolution,
            ),
          );
        });
        if (foundActivity) {
          selectedValues[type][extId] = foundActivity._id;
        }
      });
    });
    setSelectedJointTeachingValue({
      ...selectedJointTeachingValue,
      ...selectedValues,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities.length]);

  const columnPrefixRenderer = (type, [activity, __], [activityValue, ___]) => {
    if (!activity || !activityValue || Number(activity?.sequenceIdx) < 0)
      return null;

    if (isEmpty(activityValue) || !uniqueValues[type][activityValue[0].extId])
      return null;
    if (uniqueValues[type][activityValue[0].extId].length > 1) {
      return (
        <Checkbox
          checked={
            selectedJointTeachingValue[type][activityValue[0].extId] ===
            activity._id
          }
          onChange={(e) => {
            setSelectedJointTeachingValue({
              ...selectedJointTeachingValue,
              [type]: {
                ...(selectedJointTeachingValue[type] || {}),
                [activityValue[0].extId]: e.target.checked ? activity._id : '',
              },
            });
            if (typeof onSelectValue === 'function') {
              onSelectValue(type, e.target.checked, activityValue);
            }
          }}
        />
      );
    }
    return null;
  };

  return (
    <div>
      {header}
      <ActivityTable
        loading={loading}
        className={`joint-teaching-activities-table ${
          showResult ? 'show-result' : ''
        }`}
        design={design}
        activities={finalActivities}
        columnPrefix={!readonly ? columnPrefixRenderer : undefined}
        renderer={(type, activity, extId) => {
          // If not last row, continue rendering
          if (activity.sequenceIdx!! >= 0) return undefined;
          // If value type is not supported ( Array or Object ), return normal N/A or anoother text
          if (isEmpty(uniqueValues[type][extId])) return 'N/A';

          const valueItem = activity[type].find((item) => item.extId === extId);
          if (!valueItem || isEmpty(valueItem.value)) {
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
              render: (act: TActivityResult) => {
                return (
                  <div>
                    <ObjectLabel
                      objects={(Array.isArray(act.jointTeachings)
                        ? act.jointTeachings
                        : [act.jointTeaching]
                      ).map((item) => ({
                        type: 'objects',
                        extId: item?.object,
                      }))}
                    />
                  </div>
                );
              },
            },
            {
              title: 'Primary object',
              key: 'scopedObject',
              width: 250,
              render: (act: TActivityResult) => {
                return (
                  <div>
                    <ObjectLabel
                      objects={(Array.isArray(act.scopedObjects)
                        ? act.scopedObjects
                        : [act.scopedObject]
                      ).map((extId) => ({ type: 'objects', extId }))}
                    />
                  </div>
                );
              },
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
          post: readonly
            ? undefined
            : compact([
                typeof onRemove === 'function' && {
                  title: 'Actions',
                  width: '140px',
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
        jointTeachingGroupId={jointTeachingGroupId}
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
