import React, { Key, useMemo } from 'react';

import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ActivityFiltering from 'Components/ActivityFiltering';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { setFilterValues } from 'Redux/Filters/filters.actions';
import { useActivitiesWatcher } from 'Hooks/useActivities';
import { MATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
import JointTeachingGroup from 'Models/JointTeachingGroup.model';
import _ from 'lodash';

// SELECTORS
interface Props {
  formId: string;
  selectedRows: JointTeachingGroup[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onMerge: (ids: Key[]) => void;
  onRevert: (ids: Key[]) => void;
}
const JointTeachingGroupsTableToolbar = ({
  selectedRows,
  formId,
  onSelectAll,
  onDeselectAll,
  onMerge,
  onRevert,
}: Props) => {
  const selectedRowIds = useMemo(
    () => selectedRows.map(({ _id }) => _id),
    [selectedRows],
  );
  const canBeMergedGroups = selectedRows.filter(
    (group) => group.status === 'NOT_MERGED' && group.conflictsResolved,
  );
  const canBeRevertedGroups = selectedRows.filter(
    (group) => group.status !== 'NOT_MERGED',
  );

  const selectedFilterValues = useSelector(
    selectSelectedFilterValues({ formId, origin: MATCHED_ACTIVITIES_TABLE }),
  );
  const dispatch = useDispatch();
  useActivitiesWatcher({
    formId,
    filters: selectedFilterValues,
    sorters: null,
    origin: MATCHED_ACTIVITIES_TABLE,
  });
  return (
    <div className='activities-toolbar--wrapper' style={{ padding: '8px' }}>
      <span>
        Selected:&nbsp;
        {selectedRowIds.length}
      </span>
      <Button onClick={onSelectAll} type='link' size='small'>
        Select all
      </Button>
      <Button
        onClick={onDeselectAll}
        disabled={_.isEmpty(selectedRowIds)}
        type='link'
        size='small'
      >
        Deselect all
      </Button>
      <Button
        onClick={() => onMerge(canBeMergedGroups.map(({ _id }) => _id))}
        disabled={_.isEmpty(canBeMergedGroups)}
        type='link'
        size='small'
      >
        Merge selected
      </Button>
      <Button
        onClick={() => onRevert(canBeRevertedGroups.map(({ _id }) => _id))}
        disabled={_.isEmpty(canBeRevertedGroups)}
        type='link'
        size='small'
      >
        Unmerge selected
      </Button>
      <Input
        placeholder='Filter...'
        // value={filters.freeTextFilter}
        // onChange={(e) => onUpdateFilter('freeTextFilter', e.target.value)}
        suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        size='small'
      />
      <ActivityFiltering
        tableType={MATCHED_ACTIVITIES_TABLE}
        selectedFilterValues={selectedFilterValues}
        onSubmit={(values) => {
          dispatch(
            setFilterValues({
              origin: MATCHED_ACTIVITIES_TABLE,
              formId,
              values,
            }),
          );
        }}
      />
    </div>
  );
};

export default JointTeachingGroupsTableToolbar;
