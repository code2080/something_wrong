import { Menu } from 'antd';
import { capitalize, startCase } from 'lodash';
import { useSelector } from 'react-redux';

// REDUX
import { selectLookupMapForFiltering } from 'Redux/Activities';

// CONSTANTS
import {
  CUSTOM_RENDERED_FILTER_PROPERTIES_OPTIONS,
  FIXED_FILTER_PROPERTIES_ARR,
  NESTED_FILTER_PROPERTIES,
  REPLACED_KEY,
} from '../../constants';

type Props = {
  selectedFilterProperty: string;
  onSelect: (property: string) => void;
  getOptionLabel: (field: string, id?: string) => string;
};

const getFilterPropertyLabelForNonNestedProps = (prop: string) => {
  if (prop === 'weekPatternUID') return 'Week Pattern';
  return capitalize(startCase(prop));
};

const FilterProperties = ({
  selectedFilterProperty,
  onSelect,
  getOptionLabel,
}: Props) => {
  /**
   * SELECTORS
   */
  const filterLookupMap = useSelector(selectLookupMapForFiltering);
  /**
   * COMPUTED VARS
   */
  const nonNestedFilterProperties = Object.keys(filterLookupMap).filter(
    (key) =>
      !NESTED_FILTER_PROPERTIES.includes(key) &&
      FIXED_FILTER_PROPERTIES_ARR.includes(key),
  );

  return (
    <div className='filter-modal__column filter__properties'>
      <div>
        <b>Available properties</b>
      </div>
      <div className='filter-modal__box'>
        <Menu
          onSelect={({ key }) => onSelect(key)}
          selectedKeys={[selectedFilterProperty]}
        >
          {/* Render date interval filter property */}
          {Object.keys(filterLookupMap.startDate || {}).length > 0 &&
            Object.keys(filterLookupMap.endDate || {}).length > 0 && (
              <Menu.Item key='date'>Date interval</Menu.Item>
            )}

          {/* Render the fixed filter properties */}
          {CUSTOM_RENDERED_FILTER_PROPERTIES_OPTIONS.map((item) => (
            <Menu.Item key={item.value}>{item.label}</Menu.Item>
          ))}
          {/* Render the non-nested properties */}
          {nonNestedFilterProperties.map((key) => (
            <Menu.Item key={key}>
              {getFilterPropertyLabelForNonNestedProps(key)}
            </Menu.Item>
          ))}
          {/* Render objects properties */}
          {filterLookupMap.objects != null && (
            <Menu.ItemGroup key='objects' title='Objects'>
              {Object.keys(filterLookupMap.objects || {}).map((key) => (
                <Menu.Item key={`objects${REPLACED_KEY}${key}`}>
                  {getOptionLabel('objects', key)}
                </Menu.Item>
              ))}
            </Menu.ItemGroup>
          )}
          {/* Render object filters properties */}
          {filterLookupMap.objectFilters != null && (
            <Menu.ItemGroup key='objectFilters' title='Object filters'>
              {Object.keys(filterLookupMap.objectFilters || {}).map((type) => {
                return Object.keys(filterLookupMap.objectFilters[type]).map(
                  (field) => (
                    <Menu.Item
                      key={`objectFilters${REPLACED_KEY}${type}${REPLACED_KEY}${field}`}
                    >
                      {getOptionLabel('objectFilters', field)}
                    </Menu.Item>
                  ),
                );
              })}
            </Menu.ItemGroup>
          )}
          {/* Render fields properties, same logic as objects */}
          {filterLookupMap.fields != null && (
            <Menu.ItemGroup key='fields' title='fields'>
              {Object.keys(filterLookupMap.fields || {}).map((key) => (
                <Menu.Item key={`fields${REPLACED_KEY}${key}`}>
                  {getOptionLabel('fields', key)}
                </Menu.Item>
              ))}
            </Menu.ItemGroup>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default FilterProperties;
