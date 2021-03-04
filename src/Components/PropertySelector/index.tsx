import React, { useMemo } from 'react';

// COMPONENTS
import PropertySelectorItem from './Item';
import PropertySelectorHeadingItem from './HeadingItem';

// STYLES
import './index.scss';

// TYPES
import { EPropertyType, TProperty } from '../../Types/property.type';

type Props = {
  properties: TProperty[],
  onSelect: (selectedPropertyValue: string) => void,
  selectedPropertyValue?: string | null,
  emptyText?: string,
  title?: string,
}
const PropertySelector = ({
  properties,
  onSelect,
  selectedPropertyValue = null,
  emptyText,
  title,
}: Props) => {
  const hasHeadings: boolean = useMemo(() => properties.some(p => p.type === EPropertyType.HEADING), [properties]);

  return (
    <div className='property-selector--outer'>
      {title && (<div className='property-selector--title'>{title}</div>)}
      <div className={`property-selector--wrapper ${selectedPropertyValue ? 'active' : 'inactive'}`}>
        {(!properties || !properties.length) && (
          <div className='property-selector--empty'>
            {emptyText || 'No items available'}
          </div>
        )}
        {properties.map(property => {
          if (property.type === EPropertyType.HEADING)
            return (
              <PropertySelectorHeadingItem
                property={property}
                key={property.value}
              />
            );
          return (
            <PropertySelectorItem
              property={property}
              onSelect={onSelect}
              isSelected={property.value === selectedPropertyValue}
              hasHeading={hasHeadings}
              key={property.value}
            />
          );
        }
        )}
      </div>
    </div>
  );
};

export default PropertySelector;
