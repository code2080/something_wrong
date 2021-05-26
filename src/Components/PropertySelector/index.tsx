// COMPONENTS
import PropertySelectorItem from './Item';
import PropertySelectorHeadingItem from './HeadingItem';

// STYLES
import './index.scss';

// TYPES
import { TProperty } from '../../Types/property.type';

type Props = {
  properties: TProperty[];
  onSelect: (selectedPropertyValue: string) => void;
  selectedPropertyValue?: string | null;
  emptyText?: string;
  title?: string;
};
const PropertySelector = ({
  properties,
  onSelect,
  selectedPropertyValue = null,
  emptyText,
  title,
}: Props) => {
  return (
    <div className='property-selector--outer'>
      {title && <div className='property-selector--title'>{title}</div>}
      <div
        className={`property-selector--wrapper ${
          selectedPropertyValue ? 'isActive' : 'inactive'
        }`}
      >
        {(!properties || !properties.length) && (
          <div className='property-selector--empty'>
            {emptyText || 'No items available'}
          </div>
        )}
        {properties.map((property) => {
          return property.children ? (
            <>
              <PropertySelectorHeadingItem
                property={property}
                key={property.value}
              />
              {property.children.map((prop) => (
                <PropertySelectorItem
                  property={prop}
                  onSelect={onSelect}
                  isSelected={prop.value === selectedPropertyValue}
                  hasHeading
                  key={prop.value}
                />
              ))}
            </>
          ) : (
            <PropertySelectorItem
              property={property}
              onSelect={onSelect}
              isSelected={property.value === selectedPropertyValue}
              key={property.value}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PropertySelector;
