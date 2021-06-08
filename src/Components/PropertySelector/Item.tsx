// TYPES
import { TProperty } from '../../Types/property.type';
type Props = {
  property: TProperty;
  onSelect({
    parent,
    selected,
  }: {
    parent?: string | string[];
    selected: string | string[];
  }): void;
  isSelected: boolean;
  hasHeading?: boolean;
  parent?: string | string[];
};

const PropertySelectorItem = ({
  property,
  onSelect,
  isSelected,
  hasHeading = false,
  parent,
}: Props) => {
  return (
    <div
      className={`property-selector--item ${
        isSelected ? 'isActive' : 'inactive'
      } ${hasHeading ? 'has-heading' : 'no-heading'}`}
      onClick={() => onSelect({ parent, selected: property.value })}
    >
      {property.label}
    </div>
  );
};

export default PropertySelectorItem;
