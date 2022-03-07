import { useEffect, useState, useMemo } from 'react';
import { Input, Empty } from 'antd';
import { get, isEmpty, lowerCase } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

// COMPONENTS
import FilterOptions from '../FilterOptions';
import FilterItemLabel from '../FilterItemLabel';

// SELECTORS
import { activityFilterLookupMapSelector } from 'Redux/ActivitiesSlice';

// HELPERS
import { beautifyObject, flattenObject, isObject } from '../../helpers';

// CONSTANTS
import { FILTER_ITEMS_MAPPING } from '../mapping';

const filterOptionsByQuery = (query: string, options: any[]) => {
  if (!query) return options;
  return options.filter((opt) =>
    lowerCase(`${opt.label} ${opt.value}`).includes(lowerCase(query)),
  );
};
interface Props {
  selectedProperty: string;
  getOptionLabel: (field: string, id?: string) => string;
}
const FilterItems = ({
  selectedProperty,
  getOptionLabel,
}: Props) => {
  /**
   * SELECTORS
   */
  const filterLookupMap = useSelector(activityFilterLookupMapSelector);

  const allProperties = useMemo(
    () => ({
      ...filterLookupMap,
      ...flattenObject(beautifyObject(filterLookupMap), null, 2),
    }),
    [filterLookupMap],
  );
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery('');
  }, [selectedProperty]);

  const renderer = useMemo(() => {
    const fixedProperties = FILTER_ITEMS_MAPPING[selectedProperty];
    if (fixedProperties) return fixedProperties.render();

    const dynamicProperty = get(allProperties, selectedProperty);
    if (dynamicProperty) {
      const options = Object.keys(dynamicProperty).filter(
        (key) =>
          Array.isArray(dynamicProperty[key]) ||
          Number(dynamicProperty[key]) > 0,
      );
      const otherOptions = Object.keys(dynamicProperty).filter((key) =>
        isObject(dynamicProperty[key]),
      );
      if (isEmpty(options) && isEmpty(otherOptions)) return <Empty />;

      return (
        <>
          <Input
            prefix={<SearchOutlined />}
            size='small'
            placeholder='Search...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ marginBottom: '4px' }}
          />
          {!isEmpty(options) && (
            <FilterOptions
              options={filterOptionsByQuery(
                query,
                options.map((opt) => ({
                  label: getOptionLabel(selectedProperty, opt),
                  value: opt,
                })),
              )}
              label={
                <FilterItemLabel
                  label={selectedProperty}
                  render={getOptionLabel}
                />
              }
              name={selectedProperty}
            />
          )}
          {otherOptions
            .filter((key) => {
              return typeof dynamicProperty[key] === 'object';
            })
            .map((key) => (
              <FilterOptions
                key={key}
                options={filterOptionsByQuery(
                  query,
                  Object.keys(dynamicProperty[key]).map((opt) => ({
                    label: getOptionLabel(selectedProperty, opt),
                    value: opt,
                  })),
                )}
                label={
                  <FilterItemLabel
                    label={`${selectedProperty}.${key}`}
                    render={getOptionLabel}
                  />
                }
                // label={`${selectedProperty}.${key}`}
                name={`${selectedProperty}.${key}`}
              />
            ))}
        </>
      );
    }

    return <Empty />;
  }, [selectedProperty, allProperties, query, getOptionLabel]);

  return (
    <div className='filter-modal__column'>
      <div>
        <b>Available filters</b>
      </div>
      <div className='filter-modal__box'>{renderer}</div>
    </div>
  );
};

export default FilterItems;