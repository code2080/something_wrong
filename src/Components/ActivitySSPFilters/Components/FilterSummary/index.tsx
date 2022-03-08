import { isEmpty } from 'lodash';

// COMPONENTS
import TimeOrDateValueDisplay from './TimeOrDateValueDisplay';
import FixedFilterPropertyValueDisplay from './FixedFilterPropertyValueDisplay';
import NestedFilterPropertyDisplay from './NestedFieldPropertyDisplay';

// CONSTANTS
import { DATE_FORMAT } from '../../../../Constants/common.constants';
import {
  FIXED_FILTER_PROPERTIES_ARR,
  NESTED_FILTER_PROPERTIES,
} from '../../constants';

type Props = {
  selectedFilterValues: Record<string, string[]>;
  onRemoveFilterProperty: (filterProperty: string[]) => void;
  onDeselectFilterValue: (
    filterProperty: string,
    itemsToDeselect: string[],
  ) => void;
  getOptionLabel: (field: string, id?: string) => string;
};

const FilterSummary = ({
  selectedFilterValues,
  onRemoveFilterProperty,
  onDeselectFilterValue,
  getOptionLabel,
}: Props) => {

  const activeFixedFilters = FIXED_FILTER_PROPERTIES_ARR.filter(
    (fixedFilterProperty) =>
      !isEmpty(selectedFilterValues[fixedFilterProperty]),
  );

  return (
    <div className='filter-modal__column' id='filterSummary'>
      <div>
        <b>Selected filters</b>
      </div>
      <div className='filter-modal__box'>
        <TimeOrDateValueDisplay
          label='Date interval'
          filterValues={selectedFilterValues.date as [string, string] | undefined}
          onRemoveFilterProperty={() => onRemoveFilterProperty(['date'])}
          displayFormat={DATE_FORMAT}
        />
        <TimeOrDateValueDisplay
          label='Time interval'
          filterValues={selectedFilterValues.time as [string, string] | undefined}
          onRemoveFilterProperty={() => onRemoveFilterProperty(['time'])}
          displayFormat='HH:mm'
        />
        {activeFixedFilters.map((fixedFilterProperty) => (
          <FixedFilterPropertyValueDisplay
            key={fixedFilterProperty}
            filterProperty={fixedFilterProperty}
            filterValues={selectedFilterValues[fixedFilterProperty]}
            getOptionLabel={getOptionLabel}
            onDeselectFilterValue={onDeselectFilterValue}
          />
        ))}
        {NESTED_FILTER_PROPERTIES.map((nestedFilterProperty) => {
          const filterValues = Object.keys(selectedFilterValues).filter((key) => key.includes(nestedFilterProperty)).reduce((tot, key) => ({ ...tot, [key]: selectedFilterValues[key] }), {});
          if (Object.keys(filterValues).length === 0) return null;
          return (
            <NestedFilterPropertyDisplay
              key={nestedFilterProperty}
              nestedFilterProperty={nestedFilterProperty} 
              filterValues={filterValues}
              getOptionLabel={getOptionLabel}
              onDeselectFilterValue={onDeselectFilterValue}
            />
          )
        })}
      </div>
    </div>
  );
};

export default FilterSummary;
