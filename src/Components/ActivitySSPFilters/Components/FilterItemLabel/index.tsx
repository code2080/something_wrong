import { capitalize, startCase } from 'lodash';

// CONSTANTS
import {
  NESTED_FILTER_PROPERTIES,
  REPLACED_KEY,
} from 'Components/ActivitySSPFilters/constants';

const FilterItemLabel = ({
  selectedFilterProperty,
  getLabelForFilterOption,
  omitFirstKey = false,
}: {
  selectedFilterProperty: string;
  getLabelForFilterOption: (filterProperty: string, id?: string) => string;
  omitFirstKey?: boolean;
}) => {
  const keys = selectedFilterProperty.split(REPLACED_KEY);
  if (omitFirstKey) keys.splice(0, 1);

  return (
    <b>
      {keys.map((key, idx) => {
        let label: string;
        const prefix = idx === 0 ? '' : ' > ';
        if (NESTED_FILTER_PROPERTIES.includes(key)) {
          label = capitalize(startCase(key));
        } else {
          label = capitalize(
            startCase(getLabelForFilterOption(selectedFilterProperty, key)),
          );
        }
        return `${prefix}${label}`;
      })}
    </b>
  );
};

export default FilterItemLabel;
