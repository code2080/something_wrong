import React, { useContext } from 'react';

import { Row, Col } from 'antd';

import FilterProperties from './FilterProperties';
import FilterItems from './FilterItems';
import FilterSummary from './FilterSummary';
import FilterModalContainer from './FilterModalContainer';

const FilterContent = () => {
  const { filterLookupMap, selectedProperty, setSelectedProperty, values, validationError, onClear, onDeselect, getOptionLabel } = useContext(FilterModalContainer.Context);
  return (
    <div>
      <Row gutter={16} className="filter-modal__content">
        <Col span={7}>
          <FilterProperties filterLookupMap={filterLookupMap} selectedProperty={selectedProperty} onSelect={setSelectedProperty} />
        </Col>
        <Col span={7}>
          <FilterItems filterLookupMap={filterLookupMap} selectedProperty={selectedProperty} getOptionLabel={getOptionLabel} />
        </Col>
        <Col span={10}>
          <FilterSummary values={values} validationError={validationError} onClear={onClear} onDeselect={onDeselect} getOptionLabel={getOptionLabel} />
        </Col>
      </Row>
    </div>
  )
};

export default FilterContent;
