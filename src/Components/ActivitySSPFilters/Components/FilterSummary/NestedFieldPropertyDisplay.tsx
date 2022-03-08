import { capitalize } from 'lodash';
// COMPONENTS
import ValueDisplay from './ValueDisplay';
import FilterItemLabel from '../FilterItemLabel';

// TYPES
type Props = {
    filterValues: string[][],
    nestedFilterProperty: string;
    filterProperty: string;
    getOptionLabel: (filterProperty: string; id?: string) => string;
};

const NestedFieldPropertyDisplay = ({
    filterValues,
    nestedFilterProperty,
    filterProperty,
    getOptionLabel,
}: Props) => {
    return (
        <ValueDisplay
            label={capitalize(nestedFilterProperty)}
            content={
                <div>
                    <ul key={key}>
                        <li>
                        <FilterItemLabel
                            selectedFilterProperty={nestedFilterProperty}
                            getLabelForFilterOption={getOptionLabel}
                        />
                        <ul>
                            {selectedFilterValues[key]?.map((item) => (
                            <li key={item}>
                                {getOptionLabel(field, item)}
                                <CloseCircleOutlined

                                // onClick={() => onDeselect(key, [item])}
                                />
                            </li>
                            ))}
                        </ul>
                        </li>
                    </ul>
                </div>

/* <ValueDisplay
label={capitalize(field)}
content={
  <div>
    {Object.keys(fieldValues)
      .filter((key) => !isEmpty(fieldValues[key]))
      .map((key) => (
        <ul key={key}>
          <li>
            <FilterItemLabel selectedFilterProperty={key} getLabelForFilterOption={getOptionLabel} />
            <ul>
              {values[key]?.map((item) => (
                <li key={item}>
                  {getOptionLabel(field, item)}
                  <CloseCircleOutlined
                    onClick={() => onDeselect(key, [item])}
                  />
                </li>
              ))}
            </ul>
          </li>
        </ul>
      ))}
  </div>
// }
// /> */

        }
        />
    )
};

export default NestedFieldPropertyDisplay;
