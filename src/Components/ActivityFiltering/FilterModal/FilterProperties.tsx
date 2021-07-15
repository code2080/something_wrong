import React, { useMemo } from 'react';

import { Menu } from 'antd';

import { ItemsMapping } from './FilterModal.type';
import { capitalize, compact, groupBy } from 'lodash';

interface Props {
  selectedProperty: string;
  onSelect: (property: string) => void;
  propertiesMapping: ItemsMapping;
}
const FilterProperties = ({ selectedProperty, propertiesMapping, onSelect }: Props) => {
  const parentItems = useMemo(() => 
    groupBy(Object.values(propertiesMapping).filter(item => item.parent), 'parent')
  , [propertiesMapping]);

  return (
    <div className="filter-modal__column">
      <div>
        <b>Available properties</b>
      </div>
      <div className="filter-modal__box">
        <Menu onSelect={({ key }) => onSelect(key)} selectedKeys={[selectedProperty]}>
          {Object.values(propertiesMapping).filter(item => !item.parent).map(item => (
            <Menu.Item key={item.name}>{item.title}</Menu.Item>
          ))}
          {compact(Object.keys(parentItems)).map((parent: string) => (
            <Menu.ItemGroup key={parent} title={capitalize(parent)}>
              {parentItems[parent].map(item => (
                <Menu.Item key={item.name}>{item.title}</Menu.Item>
              ))}
            </Menu.ItemGroup>
          ))}
        </Menu>
      </div>
    </div>
  )
};

export default FilterProperties;
