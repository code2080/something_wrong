import React from 'react';

import { Menu } from 'antd';

import { capitalize, startCase } from 'lodash';
import { FILTER_ITEMS_MAPPING, NESTED_FIELDS } from './FilterModal.constants';
import { reparseKey } from './FilterModal.helper';

interface Props {
  selectedProperty: string;
  onSelect: (property: string) => void;
  filterLookupMap: any;
}
const FilterProperties = ({ selectedProperty, onSelect, filterLookupMap }: Props) => {
  const normalObjectsKey = Object.keys(filterLookupMap).filter(key => !NESTED_FIELDS.includes(key));
  return (
    <div className="filter-modal__column">
      <div>
        <b>Available properties</b>
      </div>
      <div className="filter-modal__box">
        <Menu onSelect={({ key }) => onSelect(key)} selectedKeys={[selectedProperty]}>
          {Object.values(FILTER_ITEMS_MAPPING).map(item => (
            <Menu.Item key={item.name}>{item.label}</Menu.Item>
          ))}
          {normalObjectsKey.map(key => (
            <Menu.Item key={key}>{capitalize(startCase(key))}</Menu.Item>
          ))}
          {NESTED_FIELDS
            .filter(field => filterLookupMap[field])
            .map(field => (
              <Menu.ItemGroup key={field} title={capitalize(startCase(field))}>
                {Object.keys(filterLookupMap[field] || {}).map(key => (
                  <Menu.Item key={`${field}.${key}`}>{reparseKey(key)}</Menu.Item>
                ))}
              </Menu.ItemGroup>
            ))}
        </Menu>
      </div>
    </div>
  )
};

export default FilterProperties;
