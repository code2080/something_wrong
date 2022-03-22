import { CloseCircleOutlined } from '@ant-design/icons';
import { capitalize, startCase } from 'lodash';

// COMPONENTS
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

const getLabelForFilterItem = (filterProperty: string) => {
  if (filterProperty === 'weekPatternUID') return 'Week Pattern';
  return capitalize(startCase(filterProperty));
}

const FixedFilterPropertyValueDisplay = ({
  filterProperty,
  filterValues,
  getOptionLabel,
  onDeselectFilterValue,
}: Props) => {
  return (
    <ValueDisplay
      label={getLabelForFilterItem(filterProperty)}
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
