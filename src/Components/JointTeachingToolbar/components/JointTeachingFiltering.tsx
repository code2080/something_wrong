import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React from 'react';

const JointTeachingFiltering = () => {
  return (
    <>
      <Input
        placeholder='Filter...'
        // value={filters.freeTextFilter}
        // onChange={(e) => onUpdateFilter('freeTextFilter', e.target.value)}
        suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        size='small'
      />
      {/* <ActivityFiltering /> */}
    </>
  );
};

export default JointTeachingFiltering;
