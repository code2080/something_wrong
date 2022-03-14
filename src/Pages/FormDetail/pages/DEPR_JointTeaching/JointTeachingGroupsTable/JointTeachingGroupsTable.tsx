import React, { useEffect, useState, Key } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { cloneDeep, compact, flatten, isEmpty, isEqual, remove } from 'lodash';

// ACTIONS
import {
  deleteJointTeachingGroup,
  addActivityToJointTeachingGroup,
  deleteActivityFromJointTeachingGroup,
  fetchJointTeachingGroupsForForm,
  mergeJointTeachingGroup,
  revertJointTeachingGroup,
  addJointTeachingConflict,
  updateJointTeachingConflict,
  removeJointTeachingConflict,
} from 'Redux/JointTeaching/jointTeaching.actions';

// SELECTORS
import { selectJointTeachingGroupsForForm } from 'Redux/JointTeaching/jointTeaching.selectors';
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';

// COMPONENTS
import { Button, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import DynamicTable from 'Components/DynamicTable/DynamicTableHOC';
import JointTeachingActivitiesTable, {
  SelectedConflictValue,
} from 'Components/DEPR_ActivitiesTable/JointTeachingActivitiesTable';
import StatusLabel from 'Components/StatusLabel';
import JointTeachingGroupsTableToolbar from './DEPR_JointTeachingGroupsTableToolbar';
import JointTeachingGroupStatusCheck from './DEPR_JointTeachingGroupStatusCheck';
import ObjectLabel from 'Components/ObjectLabel/ObjectLabel';
import JointTeachingMatchedOn from './DEPR_JointTeachingMatchedOn';

// CONSTANTS
import {
  DELETE_ACTIVITY_FROM_JOINT_TEACHING_GROUP,
  FETCH_JOINT_TEACHING_GROUPS_FOR_FORM,
  MERGE_JOINT_TEACHING_GROUP,
  REVERT_JOINT_TEACHING_GROUP,
} from 'Redux/JointTeaching/jointTeaching.actionTypes';
import JointTeachingGroup, {
  MAX_MATCHING_SCORE,
  ConflictType,
  JointTeachingConflict,
  JointTeachingStatus,
  JointTeachingConflictResolution,
} from 'Models/JointTeachingGroup.model';

import './JointTeachingGroupsTable.scss';
import { MATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
interface Props {
  readonly?: boolean;
  onGroupSelect?: (group: JointTeachingGroup) => void;
  groupSelecting?: boolean;
}

const JointTeachingGroupsTable = (props: Props) => {
  const { readonly, onGroupSelect, groupSelecting } = props;
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();

  const loading = useSelector(
    createLoadingSelector([FETCH_JOINT_TEACHING_GROUPS_FOR_FORM]),
  );
  const groups = useSelector(selectJointTeachingGroupsForForm(formId));
  const activityDesigner = useSelector((state) =>
    selectDesignForForm(state)(formId),
  );

  const buttonDisabled = useSelector(
    createLoadingSelector([
      MERGE_JOINT_TEACHING_GROUP,
      REVERT_JOINT_TEACHING_GROUP,
      DELETE_ACTIVITY_FROM_JOINT_TEACHING_GROUP,
    ]),
  );

  // actions
  const onFetchJointTeachingGroups = () => {
    return dispatch(fetchJointTeachingGroupsForForm({ formId }));
  };

  /**
    @function execThenRefetch
    @description parallel processing queue, then refetch the joint teaching matches
    @param {Array<Promise>}}
  **/
  const execThenRefetch = async (queue: Array<Promise<any>>) => {
    await Promise.all(queue);
    onFetchJointTeachingGroups();
  };

  const onDeleteActivity = async (
    jointTeachingId: string,
    activityId: string,
  ) => {
    execThenRefetch([
      dispatch(
        deleteActivityFromJointTeachingGroup({
          formId,
          jointTeachingId,
          activityIds: [activityId],
        }),
      ),
    ]);
  };
  const onAddActivity = async (jointTeachingId: string, activityIds: Key[]) => {
    execThenRefetch([
      dispatch(
        addActivityToJointTeachingGroup({
          formId,
          jointTeachingId,
          activityIds,
        }),
      ),
    ]);
  };

  const onSelectAll = () => {
    setSelectedRows(groups.map(({ _id }) => _id));
  };
  const onDeselectAll = () => {
    setSelectedRows([]);
  };

  const onMerge = async (groupIds: Key[]) => {
    execThenRefetch(
      groupIds.map((groupId) =>
        dispatch(mergeJointTeachingGroup({ formId, jointTeachingId: groupId })),
      ),
    );
  };

  const onRevert = async (groupIds: Key[]) => {
    execThenRefetch(
      groupIds.map((groupId) =>
        dispatch(
          revertJointTeachingGroup({ formId, jointTeachingId: groupId }),
        ),
      ),
    );
  };

  const onDelete = async (jointTeaching: JointTeachingGroup) => {
    if (jointTeaching.status === JointTeachingStatus.MERGED) {
      await dispatch(
        revertJointTeachingGroup({
          formId,
          jointTeachingId: jointTeaching._id,
        }),
      );
    }
    execThenRefetch([
      dispatch(
        deleteJointTeachingGroup({
          formId,
          jointTeachingId: jointTeaching._id,
        }),
      ),
    ]);
  };

  const onDeleteConflicts = (
    jointTeachingId: string,
    conflicts: JointTeachingConflict[],
  ) =>
    Promise.all(
      conflicts.map((conflict) =>
        dispatch(
          removeJointTeachingConflict({
            formId,
            jointTeachingId: jointTeachingId,
            conflictId: conflict._id,
          }),
        ),
      ),
    );

  const onAddConflicts = (
    jointTeachingId: string,
    conflicts: JointTeachingConflict[],
  ) =>
    Promise.all(
      conflicts.map((conflict) =>
        dispatch(
          addJointTeachingConflict({
            formId,
            jointTeachingId: jointTeachingId,
            conflict,
          }),
        ),
      ),
    );

  const onUpdateConflicts = (
    jointTeachingId: string,
    conflicts: JointTeachingConflict[],
  ) =>
    Promise.all(
      conflicts.map((conflict) =>
        dispatch(
          updateJointTeachingConflict({
            formId,
            jointTeachingId: jointTeachingId,
            conflict: {
              _id: conflict._id,
              resolution: conflict.resolution,
            },
          }),
        ),
      ),
    );

  const onSelectValue = (
    jointTeaching: JointTeachingGroup,
    _values: SelectedConflictValue,
  ) => {
    const values = cloneDeep(_values);
    const conflicts = [...jointTeaching.conflicts];
    const conflictsToDelete = remove(conflicts, (conflict) => {
      if (isEmpty(values[conflict.type][conflict.extId])) {
        delete values[conflict.type][conflict.extId];
        return true;
      }
    });
    const conflictsToUpdate = compact(
      conflicts.map((conflict) => {
        const resolution = values[conflict.type][conflict.extId];
        const updatedResolution = values[conflict.type][conflict.extId];
        delete values[conflict.type][conflict.extId];
        if (isEqual(conflict.resolution, updatedResolution)) return null;
        return {
          ...conflict,
          resolution: flatten(resolution as JointTeachingConflictResolution),
        };
      }),
    );
    const conflictsToAdd = Object.entries(values).flatMap(
      ([type, typeValues]) => {
        return Object.entries(typeValues)
          .filter(([, resolution]) => !isEmpty(resolution))
          .map(([extId, resolution]) => {
            return {
              type: type as ConflictType,
              extId,
              resolution: flatten(
                resolution as JointTeachingConflictResolution,
              ),
            };
          });
      },
    );
    onDeleteConflicts(jointTeaching._id, conflictsToDelete);
    onUpdateConflicts(jointTeaching._id, conflictsToUpdate);
    onAddConflicts(jointTeaching._id, conflictsToAdd);
  };

  const mergeBtn = (group: JointTeachingGroup) => {
    if (group.status === 'MERGED')
      return (
        <Button
          size='small'
          type='primary'
          danger
          onClick={() => onRevert([group._id])}
          disabled={!!buttonDisabled}
        >
          Revert
        </Button>
      );

    if (group.isScheduled === true)
      return (
        <Tooltip title='These matched activities can not be merged as it contains scheduled activities'>
          <Button
            size='small'
            type='primary'
            disabled
            style={{ padding: '0 2px' }}
          >
            <WarningOutlined /> Merge
          </Button>
        </Tooltip>
      );

    return (
      <Button
        size='small'
        type='primary'
        onClick={() => onMerge([group._id])}
        disabled={!group.conflictsResolved || !!buttonDisabled}
      >
        Merge
      </Button>
    );
  };

  const columns = compact([
    onGroupSelect && {
      title: '',
      key: 'onSelect',
      width: '60px',
      render: (group: JointTeachingGroup) => {
        return (
          <Button
            type='primary'
            onClick={() => onGroupSelect(group)}
            loading={groupSelecting}
            disabled={group.status === JointTeachingStatus.MERGED}
          >
            Select
          </Button>
        );
      },
    },
    !readonly && {
      title: ' ',
      key: 'conflictsResolved',
      render: (jointTeachingGroup: JointTeachingGroup) => (
        <JointTeachingGroupStatusCheck
          conflictsResolved={
            jointTeachingGroup.conflictsResolved &&
            !jointTeachingGroup.isScheduled
          }
        />
      ),
      width: 32,
    },
    {
      title: 'Status',
      render: (item) => (
        <StatusLabel color='default'>{item.status}</StatusLabel>
      ),
      width: '100px',
    },
    {
      title: 'Activities',
      render: (group: JointTeachingGroup) => group.activityIds.length,
      width: '100px',
    },
    {
      title: 'Primary objects',
      key: 'primaryObjects',
      render: (group: JointTeachingGroup) => (
        <div>
          <ObjectLabel
            objects={group.primaryObjects.map((extId) => ({
              type: 'objects',
              extId,
            }))}
          />
        </div>
      ),
    },
    {
      title: 'Match score',
      key: 'matchingScore',
      dataIndex: 'matchingScore',
      render: (score: number) => `${score}/${MAX_MATCHING_SCORE}`,
    },
    {
      title: 'Matched on',
      key: 'matchedOn',
      render: (jointTeachingGroup: JointTeachingGroup) => (
        <JointTeachingMatchedOn
          jointTeachingGroup={jointTeachingGroup}
          activityDesigner={activityDesigner}
        />
      ),
    },
    !readonly && {
      title: 'Action',
      key: 'action',
      width: '120px',
      render: (group: JointTeachingGroup) => {
        return (
          <div>
            {mergeBtn(group)}
            <Popconfirm
              title='Are you sure you want to delete this joint teaching match?'
              onConfirm={() => onDelete(group)}
            >
              <Button type='link' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        );
      },
    },
  ]);

  useEffect(() => {
    onFetchJointTeachingGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='joint-teaching-group__wrapper'>
      {!readonly && (
        <JointTeachingGroupsTableToolbar
          formId={formId}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          onMerge={(groupIds) => onMerge(groupIds)}
          onRevert={(groupIds) => onRevert(groupIds)}
          selectedRows={groups.filter(({ _id }) => selectedRows.includes(_id))}
        />
      )}
      <DynamicTable
        rowClassName='joint-teaching-group__row'
        columns={columns}
        dataSource={groups}
        rowKey='_id'
        isLoading={loading}
        showFilter={false}
        expandedRowRender={(group: JointTeachingGroup) => {
          const isMerged = group.status === JointTeachingStatus.MERGED;
          return (
            <JointTeachingActivitiesTable
              tableType={MATCHED_ACTIVITIES_TABLE}
              selectable={false}
              resizable={false}
              conflicts={group.conflictsMapping}
              showResult
              readonly={readonly || isMerged}
              activities={group.activities}
              formId={formId}
              onRemove={(activityId: string) => {
                onDeleteActivity(group._id, activityId);
              }}
              onAddActivity={(activityIds: Key[]) => {
                onAddActivity(group._id, activityIds);
              }}
              onSelectValue={(values) => onSelectValue(group, values)}
              jointTeachingGroupId={group._id}
            />
          );
        }}
        nowrap
        rowSelection={
          readonly
            ? null
            : {
                selectedRowKeys: selectedRows,
                onChange: (selectedRowKeys) =>
                  setSelectedRows(selectedRowKeys as Key[]),
              }
        }
      />
    </div>
  );
};

export default JointTeachingGroupsTable;
