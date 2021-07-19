import React from 'react';
import { SelectOption, ItemsMapping } from './FilterModal.type';

interface Props {
  selectedProperty: string;
  filterOptions: { [key: string]: SelectOption[] };
  propertiesMapping: ItemsMapping;
}
const FilterItems = ({ selectedProperty, filterOptions, propertiesMapping }: Props) => {
  const property = propertiesMapping[selectedProperty];
  if (!property) return null;
  return (
    <div className="filter-modal__column">
      <div>
        <b>Available filters</b>
      </div>
      <div className="filter-modal__box">
        {property.render(filterOptions[selectedProperty])}
      </div>
    </div>
  )
};

export default FilterItems;
