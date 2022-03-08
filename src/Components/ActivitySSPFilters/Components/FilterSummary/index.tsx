import { ReactChild, useMemo, useCallback, Fragment } from 'react';
import { capitalize, isEmpty, pick, startCase } from 'lodash';
import moment from 'moment';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Divider } from 'antd';

// COMPONENTS
import FilterItemLabel from '../FilterItemLabel';
import TimeOrDateValueDisplay from './TimeOrDateValueDisplay';

// CONSTANTS
import { DATE_FORMAT } from '../../../../Constants/common.constants';
import {
  FIXED_FILTER_PROPERTIES_ARR,
  NESTED_FILTER_PROPERTIES,
} from '../../constants';

// TYPES
import { TActivityFilter } from 'Types/ActivityFilterLookupMap.type';
import FixedFilterPropertyValueDisplay from './FixedFilterPropertyValueDisplay';

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
  console.log('selectedFilterValues', selectedFilerValues);
  const activeFixedFilters = FIXED_FILTER_PROPERTIES_ARR.filter(
    (fixedFilterProperty) =>
      !isEmpty(selectedFilterValues[fixedFilterProperty]),
  );

  /*   const otherFieldsDisplays = useMemo(() => {
    const fields = FIXED_FILTER_PROPERTIES_ARR;
    return fields
      .filter((key) => !isEmpty(selectedFilterValues[key]))
      .map((key) => {
        return (
          <ValueDisplay
            key={key}
            label={
              <FilterItemLabel
                selectedFilterProperty={key}
                getLabelForFilterOption={getOptionLabel}
              />
            }
            content={
              <ul>
                {selectedFilterValues[key].map((item) => (
                  <li key={item}>
                    {getOptionLabel(key, item)}
                    <CloseCircleOutlined
                      onClick={() => onDeselect(key, [item])}
                    />
                  </li>
                ))}
              </ul>
            }
          />
        );
      });
  }, [getOptionLabel, onDeselect, selectedFilterValues]); */

  // const generateObjectsDisplay = useCallback(
  //   (field) => {
  //     const fieldValues = pick(
  //       selectedFilterValues,
  //       Object.keys(selectedFilterValues).filter((key) =>
  //         key.startsWith(`${field}.`),
  //       ),
  //     );
  //     if (
  //       isEmpty(fieldValues) ||
  //       !Object.values(fieldValues).some((item) => !isEmpty(item))
  //     )
  //       return null;
  //     return (
  //       <Fragment key={field}>
  //         <Divider />
  //       </Fragment>
  //     );
  //   },
  //   [getOptionLabel, selectedFilterValues],
  // );

  // `objects__${objectTypeExtId}`: string[];
  // `fields__${fieldExtId}`: string[];
  // `objectFilters__${objectTypeExtId}___${fieldExtId}`: string[];

  const objectFilters = Object.keys(selectedFilterValues).filter((el) =>
    el.includes('objectFilters'),
  );
  const objects = Object.keys(selectedFilterValues).filter((el) =>
    el.includes('objects'),
  );
  const fields = Object.keys(selectedFilterValues).filter((el) =>
    el.includes('fields'),
  );

  return (
    <div className='filter-modal__column' id='filterSummary'>
      <div>
        <b>Selected filters</b>
      </div>
      <div className='filter-modal__box'>
        <TimeOrDateValueDisplay
          label='Date interval'
          filterValues={selectedFilterValues.date}
          onRemoveFilterProperty={() => onRemoveFilterProperty(['date'])}
          displayFormat={DATE_FORMAT}
        />
        <TimeOrDateValueDisplay
          label='Time interval'
          filterValues={selectedFilterValues.time}
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
        {/* {NESTED_FILTER_PROPERTIES.map((field) => generateObjectsDisplay(field))} */}
      </div>
    </div>
  );
};

export default FilterSummary;
