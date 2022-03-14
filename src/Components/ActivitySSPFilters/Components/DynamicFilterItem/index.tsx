import { SearchOutlined } from '@ant-design/icons';
import { Empty, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// COMPONENTS
import FilterItemLabel from '../FilterItemLabel';
import FilterOptions from '../FilterOptions';

// REDUX
import { selectAllFilterOptions } from 'Redux/Activities';

// HELPERS
import { filterFilterOptionsByQuery } from 'Components/ActivitySSPFilters/helpers';

// TYPES
type Props = {
  selectedFilterProperty: string;
  onChange: (updValue: any) => void;
  getOptionLabel: (field: string, id?: string) => string;
  value: string[];
};

const DynamicFilterItem = ({
  onChange,
  selectedFilterProperty,
  getOptionLabel,
  value,
}: Props) => {
  /**
   * STATE
   */
  const [query, setQuery] = useState('');

  /**
   * SELECTORS
   */
  const options = useSelector(selectAllFilterOptions(selectedFilterProperty));

  /**
   * EFFECTS
   */
  useEffect(() => {
    setQuery('');
  }, [selectedFilterProperty]);

  if (!options.length) return <Empty />;

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
      <FilterOptions
        onChange={onChange}
        options={filterFilterOptionsByQuery(
          query,
          options.map((value) => ({
            label: getOptionLabel(selectedFilterProperty, value),
            value,
          })),
        )}
        label={
          <FilterItemLabel
            selectedFilterProperty={selectedFilterProperty}
            getLabelForFilterOption={getOptionLabel}
          />
        }
        value={value}
      />
    </>
  );
};

export default DynamicFilterItem;
