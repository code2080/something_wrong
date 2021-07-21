import React, { useEffect, useState, useMemo } from 'react';
import { Input, Empty } from 'antd';
import { get, isEmpty, lowerCase } from 'lodash';

// CONSTANTS
import { FILTER_ITEMS_MAPPING } from './FilterModal.constants';
import { beatifyObject, flattenObject, isObject } from './FilterModal.helper';
import FilterOptions from './FilterOptionsSelectbox';
import { SearchOutlined } from '@ant-design/icons';

const filterOptionsByQuery = (query: string, options: any[]) => {
  if (!query) return options;
  return options.filter(opt => lowerCase(`${opt.label} ${opt.value}`).includes(lowerCase(query)))
};
interface Props {
  selectedProperty: string;
  filterLookupMap: any;
  getOptionLabel: (field: string, id: string) => string;
}
const FilterItems = ({ selectedProperty, filterLookupMap, getOptionLabel }: Props) => {
  const allProperties = useMemo(() => ({ ...filterLookupMap, ...flattenObject(beatifyObject(filterLookupMap), null, 2) }), [filterLookupMap]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery('');
  }, [selectedProperty]);
  
  const renderer = useMemo(() => {
    const fixedProperties = FILTER_ITEMS_MAPPING[selectedProperty];
    if (fixedProperties) return fixedProperties.render();

    const dynamicProperty = get(allProperties, selectedProperty);
    if (dynamicProperty) {
      const options = Object.keys(dynamicProperty).filter(key => Array.isArray(dynamicProperty[key]));
      const otherOptions = Object.keys(dynamicProperty).filter(key => isObject(dynamicProperty[key]));
      if (isEmpty(options) && isEmpty(otherOptions)) return <Empty />;
      
      return (
        <>
          <Input prefix={<SearchOutlined />} size="small" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} style={{ marginBottom: '4px' }} />
          {!isEmpty(options) && (
            <FilterOptions options={filterOptionsByQuery(query, options.map(opt => ({
              label: getOptionLabel(selectedProperty, opt),
              value: opt
            })))} label={selectedProperty} name={selectedProperty} />
          )}
          {otherOptions
            .filter(key => {
              return typeof dynamicProperty[key] === 'object';
            })
            .map(key => (
              <FilterOptions key={key} options={filterOptionsByQuery(query, Object.keys(dynamicProperty[key]).map(opt => ({
                label: getOptionLabel(selectedProperty, opt),
                value: opt
              })))} label={`${selectedProperty}.${key}`} name={`${selectedProperty}.${key}`} />
            ))}
        </>
      );
    }

    return <Empty />;
  }, [selectedProperty, allProperties, query])
  
  return (
    <div className="filter-modal__column">
      <div>
        <b>Available filters</b>
      </div>
      <div className="filter-modal__box">
        {renderer}
      </div>
    </div>
  )
  // if (!property) return null;
  // return (
  //   <div className="filter-modal__column">
  //     <div>
  //       <b>Available filters</b>
  //     </div>
  //     <div className="filter-modal__box">
  //       {property.render(filterOptions[selectedProperty])}
  //     </div>
  //   </div>
  // )
};

export default FilterItems;
