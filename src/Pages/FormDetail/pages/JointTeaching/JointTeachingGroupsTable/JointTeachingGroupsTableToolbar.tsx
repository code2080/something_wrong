import React, { Key } from 'react';

import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ActivityFiltering from 'Components/ActivityFiltering';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedFilterItemsForMatchedActivities } from 'Redux/Filters/filters.selectors';
import { setFilterValues } from 'Redux/Filters/filters.actions';
import { useActivitiesWatcher } from 'Hooks/useActivities';

// SELECTORS

interface Props {
  formId: string;
  selectedRows: Key[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onMerge: (ids: Key[]) => void;
  onRevert: (ids: Key[]) => void;
}
const JointTeachingGroupsTableToolbar = ({
  selectedRows,
  onSelectAll,
  onDeselectAll,
  onMerge,
  onRevert,
  formId,
}: Props) => {
  const selectedFilterValues = useSelector(
    selectSelectedFilterItemsForMatchedActivities(formId),
  );
  const dispatch = useDispatch();
  useActivitiesWatcher({
    formId,
    filters: selectedFilterValues,
    origin: 'matchedActivities',
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
        disabled={!selectedRows.length}
        type='link'
        size='small'
      >
        Merge selected
      </Button>
      <Button
        onClick={() => onRevert(selectedRows)}
        disabled={!selectedRows.length}
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
        selectedFilterValues={selectedFilterValues}
        onSubmit={(values) => {
          dispatch(
            setFilterValues({
              origin: 'matchedActivities',
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
