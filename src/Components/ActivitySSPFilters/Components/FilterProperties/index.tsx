import { Menu } from 'antd';
import { capitalize, startCase } from 'lodash';
import { useSelector } from 'react-redux';

// HELPERS
import { reparseKey } from '../../helpers';

// REDUX
import { selectLookupMapForFiltering } from 'Redux/ActivitiesSlice';

// CONSTANTS
import { FIXED_FILTER_PROPERTIES_OPTIONS, NESTED_FIELDS, REPLACED_KEY } from '../../constants';

type Props = {
  selectedFilterProperty: string;
  onSelect: (property: string) => void;
  getOptionLabel: (field: string, id?: string) => string;
}

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
  const nonNestedFilterProperties = Object.keys(filterLookupMap).filter((key) => !NESTED_FIELDS.includes(key));

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
          {/* Render the fixed filter properties */}
          {FIXED_FILTER_PROPERTIES_OPTIONS.map((item) => (
            <Menu.Item key={item.value}>{item.label}</Menu.Item>
          ))}
          {/* Render the non-nested properties */}
          {nonNestedFilterProperties.map((key) => (
            <Menu.Item key={key}>{capitalize(startCase(key))}</Menu.Item>
          ))}
          {/* Render objects properties */}
          {filterLookupMap.objects != null && (
            <Menu.ItemGroup key="objects" title="Objects">
              {Object.keys(filterLookupMap.objects || {}).map((key) => (
                <Menu.Item key={`objects${REPLACED_KEY}${key}`}>
                  {getOptionLabel(reparseKey(key))}
                </Menu.Item>
              ))}
            </Menu.ItemGroup>
          )}
          {/* Render object filters properties */}
          {filterLookupMap.objectFilters != null && (
            <Menu.ItemGroup key="objectFilters" title="Object filters">
              {Object.keys(filterLookupMap.objectFilters || {}).map((type) => {
                return Object.keys(filterLookupMap.objectFilters[type]).map((field) => (
                  <Menu.Item key={`objectFilters${REPLACED_KEY}${type}${REPLACED_KEY}${field}`}>
                    {getOptionLabel(reparseKey(field))}
                  </Menu.Item>
                ))
              })}
            </Menu.ItemGroup>
          )}
          {/* Render fields properties, same logic as objects */}
          {filterLookupMap.fields != null && (
            <Menu.ItemGroup key="fields" title="fields">
              {Object.keys(filterLookupMap.fields || {}).map((key) => (
                <Menu.Item key={`fields${REPLACED_KEY}${key}`}>
                  {getOptionLabel(reparseKey(key))}
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
