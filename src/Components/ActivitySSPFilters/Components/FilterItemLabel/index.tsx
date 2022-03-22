import { capitalize, startCase } from 'lodash';

// CONSTANTS
import {
  NESTED_FILTER_PROPERTIES,
  REPLACED_KEY,
} from 'Components/ActivitySSPFilters/constants';

// TYPES
type Props = {
  selectedFilterProperty: string;
  getLabelForFilterOption: (filterProperty: string, id?: string) => string;
  omitFirstKey?: boolean;
};

const getLabelForFilterItem = (prop: string, key: string, labelFn: any, ) => {
  if (key && NESTED_FILTER_PROPERTIES.includes(key))
    return capitalize(startCase(key));
  if (prop === 'weekPatternUID') return 'Week Pattern';
  return capitalize(startCase(labelFn(prop, key)));
}

const FilterItemLabel = ({
  selectedFilterProperty,
  getLabelForFilterOption,
  omitFirstKey = false,
}: Props) => {
  const keys = selectedFilterProperty.split(REPLACED_KEY);
  if (omitFirstKey) keys.splice(0, 1);

  return (
    <b>
      {keys.map((key, idx) => {
        const prefix = idx === 0 ? '' : ' > ';
        const label = getLabelForFilterItem(selectedFilterProperty, key, getLabelForFilterOption);
        return `${prefix}${label}`;
      })}
    </b>
  );
};

export default FilterItemLabel;
