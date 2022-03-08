import { useMemo } from 'react';

// COMPONENTS
import DateFilterItem from '../DateFilterItem';
import TimeFilterItem from '../TimeFilterItem';
import StatusFilterItem from '../StatusFilterItem';
import DynamicFilterItem from '../DynamicFilterItem';

type Props = {
  selectedFilterProperty: string;
  selectedFilterValues: any; // @todo type
  onSelectFilterValue: (val: any) => void;
  getOptionLabel: (field: string, id?: string) => string;
};

const FilterItems = ({
  selectedFilterProperty,
  selectedFilterValues,
  onSelectFilterValue,
  getOptionLabel,
}: Props) => {
  const renderedItemComponent = useMemo(() => {
    switch (selectedFilterProperty) {
      case 'date':
        return <DateFilterItem onChange={onSelectFilterValue} />;
      case 'time':
        return <TimeFilterItem onChange={onSelectFilterValue} />;
      case 'status':
        return (
          <StatusFilterItem 
            onChange={onSelectFilterValue}
            value={selectedFilterValues.status}
          />
        );
      default:
        return (
          <DynamicFilterItem 
            onChange={onSelectFilterValue}
            selectedFilterProperty={selectedFilterProperty}
            getOptionLabel={getOptionLabel}
            value={selectedFilterValues[selectedFilterProperty]}
          />
        );
    }
  }, [onSelectFilterValue, selectedFilterValues, selectedFilterProperty, getOptionLabel]);

  return (
    <div className='filter-modal__column'>
      <div>
        <b>Available filters</b>
      </div>
      <div className='filter-modal__box'>{renderedItemComponent}</div>
    </div>
  );
};

export default FilterItems;