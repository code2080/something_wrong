import React from 'react';

import { Row, Col } from 'antd';
import FilterProperties from './FilterProperties';
import FilterItems from './FilterItems';
import FilterSummary from './FilterSummary';

const FilterContent = () => {
  return (
    <Row gutter={16} className="filter-modal__content">
      <Col span={8}>
        <FilterProperties />
      </Col>
      <Col span={8}>
        <FilterItems />
      </Col>
      <Col span={8}>
        <FilterSummary />
      </Col>
    </Row>
  )
};

export default FilterContent;
