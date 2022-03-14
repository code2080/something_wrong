import React, { useMemo, ReactChild, useState, Key, useEffect } from 'react';
import _, {
  chain,
  compact,
  flatten,
  isEmpty,
  isEqual,
  keyBy,
  uniq,
} from 'lodash';

// COMPONENTS
import ActivityTable from '../../Pages/FormDetail/pages/Activities/DEPR_ActivityTable';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popconfirm } from 'antd';

// TYPES
import { TActivity } from '../../Types/Activity/Activity.type';
import { useSelector } from 'react-redux';

// SELECTORS
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import { calculateActivityConflicts } from 'Utils/activities.helpers';

import './JointTeachingActivitiesTable.scss';
import AddActivitiesToJointTeachingGroupModal from '../../Pages/FormDetail/pages/JointTeaching/JointTeachingModals/AddActivitiesToJointTeachingGroupModal';
import { selectActivitiesUniqueValues } from '../../Redux/DEPR_Activities/activities.selectors';
import { ActivityValue, ValueType } from 'Types/Activity/ActivityValue.type';
import {
  ConflictType,
  JointTeachingConflictMapping,
} from 'Models/JointTeachingGroup.model';
import ObjectLabel from 'Components/ObjectLabel/ObjectLabel';

export interface SelectedConflictValue {
  [type: string]: { [key: string]: Array<ValueType | undefined> };
}
interface Props {
  formId: string;
  activities: TActivity[];
  readonly?: boolean;
  showResult?: boolean;
  onRemove?: (activityId: string) => void;
  onAddActivity?: (activityIds: Key[]) => void;
  onSelectValue?: (values: SelectedConflictValue) => void;
  footer?: ReactChild;
  header?: ReactChild;
  selectedActivities?: Key[];
  jointTeachingGroupId?: string;
  onSelect?(selectedRowKeys: Key[]): void;
  conflicts?: JointTeachingConflictMapping;
  loading?: boolean;
  selectable?: boolean;
  resizable?: boolean;
  tableType?: string;
  hasPagination?: boolean;
}

interface TableProps extends Omit<Props, ''> {
  allElementIds: string[];
  onSetCurrentPaginationParams?: (page: number, limit: number) => void;
  paginationParams?: { limit: number; currentPage: number; totalPages: number };
}
interface TActivityResult extends TActivity {
  jointTeachings: Array<{ object: string; typeExtId: string }>;
  scopedObjects: string[];
}

const JointTeachingActivitiesTable = (props: TableProps) => {
  const [selectedJointTeachingValue, setSelectedJointTeachingValue] =
    useState<SelectedConflictValue>({
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
    tableType,
    selectable,
    onSetCurrentPaginationParams,
    paginationParams,
    resizable,
  } = props;
  const design = useSelector(selectDesignForForm)(formId);
  const submissions = useSelector((state) =>
    makeSelectSubmissions()(state, formId),
  );
  const uniqueValues = useSelector(
    selectActivitiesUniqueValues(formId, activities),
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
    const { values: mergedActivityValues, timing: mergedActivityTiming } =
      calculateActivityConflicts(activities, selectedJointTeachingValue);

    if (!firstActivity) return null;
    return {
      ...firstActivity,
      _id: 'result-row',
      timing: firstActivity.timing.map((val) => ({
        ...val,
        value: mergedActivityTiming[val.extId] || [],
      })),
      values: firstActivity.values.map((val) => ({
        ...val,
        value: mergedActivityValues[val.extId] || [],
      })),
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
    const initialSelectedValues = Object.entries(conflicts).reduce(
      (results, [type, values]) => {
        return {
          ...results,
          [type]: Object.entries(values).reduce(
            (typeResults, [extId, conflictValue]) => ({
              ...typeResults,
              [extId]: conflictValue.resolution,
            }),
            {},
          ),
        };
      },
      {},
    );
    setSelectedJointTeachingValue({
      ...selectedJointTeachingValue,
      ...initialSelectedValues,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities.length]);

  const onSelectedValuesChange = (
    type: ConflictType,
    checked: boolean,
    activityValues: ActivityValue[],
  ) => {
    const extId = activityValues[0].extId;
    const isArray = Array.isArray(activityValues[0].value);
    let updatedSelectedValues = {};
    if (checked) {
      updatedSelectedValues = {
        ...selectedJointTeachingValue,
        [type]: {
          ...selectedJointTeachingValue[type],
          [extId]: [
            ...(isArray ? selectedJointTeachingValue[type][extId] || [] : []),
            ...flatten(
              activityValues.map((activityValue) => activityValue.value),
            ),
          ],
        },
      };
    } else {
      updatedSelectedValues = {
        ...selectedJointTeachingValue,
        [type]: {
          ...selectedJointTeachingValue[type],
          [extId]: selectedJointTeachingValue[type][extId].filter((item) => {
            return !activityValues.every((actVal) =>
              isEqual(flatten([actVal.value]), flatten([item])),
            );
          }),
        },
      };
    }
    setSelectedJointTeachingValue(updatedSelectedValues);
    if (typeof onSelectValue === 'function') {
      onSelectValue(updatedSelectedValues);
    }
  };

  const columnPrefixRenderer = (type, [activity, __], [activityValue, ___]) => {
    if (!activity || !activityValue || Number(activity?.sequenceIdx) < 0)
      return null;

    if (isEmpty(activityValue) || !uniqueValues[type][activityValue[0].extId])
      return null;
    if (uniqueValues[type][activityValue[0].extId].length > 1) {
      return (
        <Checkbox
          checked={(
            selectedJointTeachingValue[type][activityValue[0].extId] || []
          ).some((selectedVals) => {
            return activityValue.every((actVal) => {
              return isEqual(flatten([actVal.value]), flatten([selectedVals]));
            });
          })}
          onChange={(e) => {
            onSelectedValuesChange(type, e.target.checked, activityValue);
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
        selectable={selectable}
        tableType={tableType}
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
              key: 'primaryObject',
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
                  width: 100,
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
        onSetCurrentPaginationParams={onSetCurrentPaginationParams}
        paginationParams={paginationParams}
        resizable={resizable}
      />
      <AddActivitiesToJointTeachingGroupModal
        formId={formId}
        visible={addActivityModalVisible}
        onCancel={() => setAddActivityModalVisible(false)}
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
