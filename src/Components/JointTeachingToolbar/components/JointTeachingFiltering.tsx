import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ActivityFiltering from 'Components/DEPR_ActivityFiltering';

// SELECTORS
import { selectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { setFilterValues } from 'Redux/Filters/filters.actions';
import { UNMATCHED_ACTIVITIES_TABLE } from 'Constants/tables.constants';

const JointTeachingFiltering = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const selectedFilterValues = useSelector(
    selectSelectedFilterValues({ formId, origin: UNMATCHED_ACTIVITIES_TABLE }),
  );

  return (
    <>
      <Input
        placeholder='Filter...'
        // value={filters.freeTextFilter}
        // onChange={(e) => onUpdateFilter('freeTextFilter', e.target.value)}
        suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        size='small'
      />
      <ActivityFiltering
        tableType={UNMATCHED_ACTIVITIES_TABLE}
        selectedFilterValues={selectedFilterValues}
        onSubmit={(values) => {
          dispatch(
            setFilterValues({
              origin: UNMATCHED_ACTIVITIES_TABLE,
              values,
              formId,
            }),
          );
        }}
      />
    </>
  );
};

export default JointTeachingFiltering;
