import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';

// STYLES
import './FilterBar.scss';

const FilterBar = ({ query, onChange }) => (
  <div className='filter-bar--wrapper'>
    <Input
      placeholder='Filter...'
      value={query}
      onChange={e => onChange(e.target.value)}
      suffix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />}
      size='small'
    />
  </div>
);

FilterBar.propTypes = {
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

FilterBar.defaultProps = {
  query: '',
};

export default FilterBar;
