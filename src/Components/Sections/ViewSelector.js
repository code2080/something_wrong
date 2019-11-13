import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'antd';

// CONSTANTS
import { sectionViews } from '../../Constants/sectionViews.constants';

const ViewSelector = ({ view, onViewChange }) => (
  <React.Fragment>
    <span style={{ marginRight: '0.4rem', color: 'rgb(128, 128, 128)' }}>View as:</span>
    <Radio.Group
      onChange={e => onViewChange(e.target.value)}
      defaultValue={view}
      size="small"
    >
      <Radio.Button value={sectionViews.TABLE_VIEW}>Table</Radio.Button>
      <Radio.Button value={sectionViews.LIST_VIEW}>List</Radio.Button>
    </Radio.Group>
  </React.Fragment>
);

ViewSelector.propTypes = {
  view: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
};

export default ViewSelector;
