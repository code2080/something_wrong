import { CloseCircleOutlined } from '@ant-design/icons';
import { TActivityFilter } from 'Types/ActivityFilterLookupMap.type';
import FilterItemLabel from '../FilterItemLabel';
import ValueDisplay from './FilterValueDisplay';

type Props = {
  filterProperty: string;
  filterValues: string[];
  getOptionLabel: (field: string, id?: string) => string;
  onDeselectFilterValue: (
    filterProperty: string,
    filterValues: string[],
  ) => void;
};

const FixedFilterPropertyValueDisplay = ({
  filterProperty,
  filterValues,
  getOptionLabel,
  onDeselectFilterValue,
}: Props) => {
  return (
    <ValueDisplay
      label={
        <FilterItemLabel
          selectedFilterProperty={filterProperty}
          getLabelForFilterOption={getOptionLabel}
        />
      }
      content={
        <ul>
          {filterValues.map((value) => (
            <li key={value}>
              {getOptionLabel(filterProperty, value)}
              <CloseCircleOutlined
                onClick={() => onDeselectFilterValue(filterProperty, [value])}
              />
            </li>
          ))}
        </ul>
      }
    />
  );
};

export default FixedFilterPropertyValueDisplay;
