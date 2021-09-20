import React, { useEffect, useState, Key } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compact } from 'lodash';

// ACTIONS
import {
  deleteJointTeachingGroup,
  addActivityToJointTeachingGroup,
  deleteActivityFromJointTeachingGroup,
  fetchJointTeachingGroupsForForm,
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
import JointTeachingGroup from 'Models/JointTeachingGroup.model';
import JointTeachingActivitiesTable from 'Components/ActivitiesTable/JointTeachingActivitiesTable';
import StatusLabel from 'Components/StatusLabel/StatusLabel';

import './JointTeachingGroupsTable.scss';
import JointTeachingGroupsTableToolbar from './JointTeachingGroupsTableToolbar';
import JointTeachingGroupStatusCheck from './JointTeachingGroupStatusCheck';

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
  const onMerge = (groupIds: Key[]) => {
    console.log(`Merge ${groupIds.join(' ,')}`);
  };
  const onUnmerge = (groupIds: Key[]) => {
    console.log(`Unmerge ${groupIds.join(' ,')}`);
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

  const mergeBtn = (group: JointTeachingGroup) => {
    if (group.status === 'MERGED')
      return (
        <Button size='small' type='primary' danger>
          Revert
        </Button>
      );
    return (
      <Button size='small' type='primary'>
        Merge
      </Button>
    );
  };

  const columns = compact([
    !readonly && {
      title: ' ',
      render: (jointTeachingGroup: JointTeachingGroup) => (
        <JointTeachingGroupStatusCheck
          jointTeachingGroup={jointTeachingGroup}
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
      render: () => 'N/A',
    },
    {
      title: 'Match score',
      key: 'matchScore',
      render: () => 'N/A',
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
  }, []);

  return (
    <div className='joint-teaching-group__wrapper'>
      {!readonly && (
        <JointTeachingGroupsTableToolbar
          formId={formId}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          onMerge={onMerge}
          onUnmerge={onUnmerge}
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
            showResult
            readonly={readonly}
            activities={group.activities}
            formId={formId}
            onRemove={(activityId: string) => {
              onDeleteActivity(group._id, activityId);
            }}
            onAddActivity={(activityIds: Key[]) => {
              onAddActivity(group._id, activityIds);
            }}
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
