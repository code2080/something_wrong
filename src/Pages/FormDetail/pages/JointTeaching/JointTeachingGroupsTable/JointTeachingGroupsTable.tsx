import React, { useEffect, useState, Key } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compact, isEmpty } from 'lodash';

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

// COMPONENTS
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import DynamicTable from 'Components/DynamicTable/DynamicTableHOC';

// CONSTANTS
import { FETCH_JOINT_TEACHING_GROUPS_FOR_FORM } from 'Redux/JointTeaching/jointTeaching.actionTypes';
import JointTeachingGroup, {
  MAX_MATCHING_SCORE,
  ConflictType,
  JointTeachingConflict,
} from 'Models/JointTeachingGroup.model';
import JointTeachingActivitiesTable from 'Components/ActivitiesTable/JointTeachingActivitiesTable';
import StatusLabel from 'Components/StatusLabel/StatusLabel';

import './JointTeachingGroupsTable.scss';
import JointTeachingGroupsTableToolbar from './JointTeachingGroupsTableToolbar';
import JointTeachingGroupStatusCheck from './JointTeachingGroupStatusCheck';
import { ActivityValue } from 'Types/ActivityValue.type';

interface Props {
  readonly?: boolean;
  onGroupSelect?: (groupId: string) => void;
}

const JointTeachingGroupsTable = (props: Props) => {
  const { readonly, onGroupSelect } = props;
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();
  const loading = useSelector(
    createLoadingSelector([FETCH_JOINT_TEACHING_GROUPS_FOR_FORM]),
  );

  const groups = useSelector(selectJointTeachingGroupsForForm(formId));

  // actions
  const onFetchJointTeachingGroups = () => {
    return dispatch(fetchJointTeachingGroupsForForm({ formId }));
  };
  const onDeleteActivity = async (
    jointTeachingId: string,
    activityId: string,
  ) => {
    await dispatch(
      deleteActivityFromJointTeachingGroup({
        formId,
        jointTeachingId,
        activityIds: [activityId],
      }),
    );
    onFetchJointTeachingGroups();
  };
  const onAddActivity = async (jointTeachingId: string, activityIds: Key[]) => {
    await dispatch(
      addActivityToJointTeachingGroup({
        formId,
        jointTeachingId,
        activityIds,
      }),
    );
    onFetchJointTeachingGroups();
  };

  const onSelectAll = () => {
    setSelectedRows(groups.map(({ _id }) => _id));
  };
  const onDeselectAll = () => {
    setSelectedRows([]);
  };
  const onMerge = async (groupIds: Key[]) => {
    await Promise.all(
      groupIds.map((groupId) =>
        dispatch(mergeJointTeachingGroup({ formId, jointTeachingId: groupId })),
      ),
    );
    dispatch(fetchJointTeachingGroupsForForm({ formId }));
  };
  const onRevert = async (groupIds: Key[]) => {
    await Promise.all(
      groupIds.map((groupId) =>
        dispatch(
          revertJointTeachingGroup({ formId, jointTeachingId: groupId }),
        ),
      ),
    );
    dispatch(fetchJointTeachingGroupsForForm({ formId }));
  };
  const onDelete = async (jointTeachingId: string) => {
    await dispatch(
      deleteJointTeachingGroup({
        formId,
        jointTeachingId,
      }),
    );
    onFetchJointTeachingGroups();
  };

  const onSelectValue = (
    jointTeaching: JointTeachingGroup,
    {
      type,
      checked,
      activityValue,
    }: { type: ConflictType; checked: boolean; activityValue: ActivityValue },
  ) => {
    if (isEmpty(activityValue)) return;
    const { conflictsMapping } = jointTeaching;
    const { value, extId } = activityValue[0];
    const resolution = Array.isArray(value) ? value : [value];
    const foundConflict = conflictsMapping[type]?.[extId];
    if (checked) {
      if (foundConflict) {
        dispatch(
          updateJointTeachingConflict({
            formId,
            jointTeachingId: jointTeaching._id,
            conflict: {
              _id: foundConflict._id,
              resolution,
            },
          }),
        );
      } else {
        const conflict: JointTeachingConflict = {
          type,
          resolution,
          extId,
        };
        dispatch(
          addJointTeachingConflict({
            formId,
            jointTeachingId: jointTeaching._id,
            conflict,
          }),
        );
      }
    } else {
      dispatch(
        removeJointTeachingConflict({
          formId,
          jointTeachingId: jointTeaching._id,
          conflictId: foundConflict._id,
        }),
      );
    }
  };

  const mergeBtn = (group: JointTeachingGroup) => {
    if (group.status === 'MERGED')
      return (
        <Button
          size='small'
          type='primary'
          danger
          onClick={() => onRevert([group._id])}
        >
          Revert
        </Button>
      );
    return (
      <Button
        size='small'
        type='primary'
        onClick={() => onMerge([group._id])}
        disabled={!group.conflictsResolved}
      >
        Merge
      </Button>
    );
  };

  const columns = compact([
    !readonly && {
      title: ' ',
      key: 'conflictsResolved',
      render: (jointTeachingGroup: JointTeachingGroup) => (
        <JointTeachingGroupStatusCheck
          conflictsResolved={jointTeachingGroup.conflictsResolved}
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
      render: (group: JointTeachingGroup) => group.primaryObjects.join(', '),
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
      render: () => 'N/A',
    },
    !readonly && {
      title: 'Action',
      key: 'action',
      width: '60px',
      render: (group: JointTeachingGroup) => {
        return (
          <div>
            {mergeBtn(group)}
            <Popconfirm
              title='Are you sure you want to delete this joint teaching group?'
              onConfirm={() => onDelete(group._id)}
            >
              <Button type='link' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        );
      },
    },
    onGroupSelect && {
      title: '',
      key: 'onSelect',
      width: '60px',
      render: (group: JointTeachingGroup) => {
        return (
          <Button type='primary' onClick={() => onGroupSelect(group._id)}>
            Select
          </Button>
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
          onMerge={() => onMerge(selectedRows)}
          onRevert={() => onRevert(selectedRows)}
          selectedRows={selectedRows}
        />
      )}
      <DynamicTable
        rowClassName='joint-teaching-group__row'
        columns={columns}
        dataSource={groups}
        rowKey='_id'
        isLoading={loading}
        expandedRowRender={(group: JointTeachingGroup) => (
          <JointTeachingActivitiesTable
            conflicts={group.conflictsMapping}
            showResult
            readonly={readonly || group.status === 'MERGED'}
            activities={group.activities}
            formId={formId}
            onRemove={(activityId: string) => {
              onDeleteActivity(group._id, activityId);
            }}
            onAddActivity={(activityIds: Key[]) => {
              onAddActivity(group._id, activityIds);
            }}
            onSelectValue={(type, checked, activityValue) =>
              onSelectValue(group, { type, checked, activityValue })
            }
          />
        )}
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
