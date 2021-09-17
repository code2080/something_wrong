import { Menu } from 'antd';

import { capitalize, startCase } from 'lodash';
import { useSelector } from 'react-redux';
import { selectIsBetaOrDev } from 'Redux/Auth/auth.selectors';
import { FILTER_ITEMS_MAPPING, NESTED_FIELDS } from './FilterModal.constants';
import { reparseKey } from './FilterModal.helper';

interface Props {
  selectedProperty: string;
  onSelect: (property: string) => void;
  filterLookupMap: any;
  getOptionLabel: (field: string, id?: string) => string;
}
const FilterProperties = ({
  selectedProperty,
  onSelect,
  filterLookupMap,
  getOptionLabel,
}: Props) => {
  const isBeta = useSelector(selectIsBetaOrDev);
  const normalObjectsKey = Object.keys(filterLookupMap).filter(
    (key) => !NESTED_FIELDS.includes(key),
  );
  return (
    <div className='filter-modal__column filter__properties'>
      <div>
        <b>Available properties</b>
      </div>
      <div className='filter-modal__box'>
        <Menu
          onSelect={({ key }) => onSelect(key)}
          selectedKeys={[selectedProperty]}
        >
          {Object.values(FILTER_ITEMS_MAPPING(isBeta)).map((item) => (
            <Menu.Item key={item.name}>{item.label}</Menu.Item>
          ))}
          {normalObjectsKey.map((key) => (
            <Menu.Item key={key}>{capitalize(startCase(key))}</Menu.Item>
          ))}
          {NESTED_FIELDS.filter((field) => filterLookupMap[field]).map(
            (field) => (
              <Menu.ItemGroup key={field} title={capitalize(startCase(field))}>
                {Object.keys(filterLookupMap[field] || {}).map((key) => (
                  <Menu.Item key={`${field}.${key}`}>
                    {getOptionLabel(reparseKey(key))}
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            ),
          )}
        </Menu>
      </div>
    </div>
  );
};

export default FilterProperties;
