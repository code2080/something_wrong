// TYPES
import { TProperty } from '../../Types/property.type';
type Props = {
  property: TProperty;
  onSelect: (selectedValue: string) => void;
  isSelected: boolean;
  hasHeading?: boolean;
};

const PropertySelectorItem = ({
  property,
  onSelect,
  isSelected,
  hasHeading = false,
}: Props) => {
  return (
    <div
      className={`property-selector--item ${
        isSelected ? 'isActive' : 'inactive'
      } ${hasHeading ? 'has-heading' : 'no-heading'}`}
      onClick={() => onSelect(property.value)}
    >
      {property.label}
    </div>
  );
};

export default PropertySelectorItem;
