import React, { Key } from 'react';

import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ActivityFiltering from 'Components/ActivityFiltering';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { setFilterValues } from 'Redux/Filters/filters.actions';
import { useActivitiesWatcher } from 'Hooks/useActivities';
import { MATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';
import _ from 'lodash';

// SELECTORS
interface Props {
  formId: string;
  selectedRows: Key[];
  groups: any;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onMerge: (ids: Key[]) => void;
  onRevert: (ids: Key[]) => void;
}
const JointTeachingGroupsTableToolbar = ({
  selectedRows,
  formId,
  groups,
  onSelectAll,
  onDeselectAll,
  onMerge,
  onRevert,
}: Props) => {
  const disableMergeSelectedBtn = () =>
    _.isEmpty(
      groups.filter(
        (group) =>
          _.includes(selectedRows, group._id) && group.status === 'NOT_MERGED',
      ),
    );

  const disableRevertSelectedBtn = () =>
    _.isEmpty(
      groups.filter(
        (group) =>
          _.includes(selectedRows, group._id) && group.status === 'MERGED',
      ),
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
        {selectedRows.length}
      </span>
      <Button onClick={onSelectAll} type='link' size='small'>
        Select all
      </Button>
      <Button
        onClick={onDeselectAll}
        disabled={!selectedRows.length}
        type='link'
        size='small'
      >
        Deselect all
      </Button>
      <Button
        onClick={() => onMerge(selectedRows)}
        disabled={!selectedRows.length || disableMergeSelectedBtn()}
        type='link'
        size='small'
      >
        Merge selected
      </Button>
      <Button
        onClick={() => onRevert(selectedRows)}
        disabled={!selectedRows.length || disableRevertSelectedBtn}
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
