import React, { useContext } from 'react';

import { Row, Col } from 'antd';

import FilterProperties from './FilterProperties';
import FilterItems from './FilterItems';
import FilterSummary from './FilterSummary';
import FilterModalContainer from './FilterModalContainer';

const FilterContent = () => {
  const { selectedProperty, setSelectedProperty, filterOptions, propertiesMapping, values } = useContext(FilterModalContainer.Context);
  return (
    <div>
      <Row gutter={16} className="filter-modal__content">
        <Col span={7}>
          <FilterProperties selectedProperty={selectedProperty} onSelect={setSelectedProperty} propertiesMapping={propertiesMapping} />
        </Col>
        <Col span={7}>
        <FilterItems selectedProperty={selectedProperty} filterOptions={filterOptions} propertiesMapping={propertiesMapping} />
        </Col>
        <Col span={10}>
          <FilterSummary values={values} filterOptions={filterOptions} />
        </Col>
      </Row>
    </div>
  )
};

export default FilterContent;
