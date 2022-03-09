import { capitalize, startCase } from 'lodash';
// COMPONENTS
import ValueDisplay from './ValueDisplay';
import FilterItemLabel from '../FilterItemLabel';
import { CloseCircleOutlined } from '@ant-design/icons';

// TYPES
type Props = {
  filterValues: Record<string, string[]>;
  nestedFilterProperty: string;
  getOptionLabel: (filterProperty: string, id?: string) => string;
  onDeselectFilterValue: (
    filterProperty: string,
    filterValues: string[],
  ) => void;
};

const NestedFilterPropertyDisplay = ({
  filterValues,
  nestedFilterProperty,
  getOptionLabel,
  onDeselectFilterValue,
}: Props) => {
  return (
    <ValueDisplay
      label={capitalize(startCase(nestedFilterProperty))}
      content={Object.keys(filterValues).map((filterProperty) => (
        <div key={filterProperty}>
          <div>
            <FilterItemLabel
              selectedFilterProperty={filterProperty}
              getLabelForFilterOption={getOptionLabel}
              omitFirstKey
            />
          </div>
          <ul>
            {(filterValues[filterProperty] || []).map((filterValue) => (
              <li key={filterValue}>
                {getOptionLabel(filterProperty, filterValue)}
                <CloseCircleOutlined
                  onClick={() =>
                    onDeselectFilterValue(filterProperty, [filterValue])
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    />
  );
};

export default NestedFilterPropertyDisplay;
