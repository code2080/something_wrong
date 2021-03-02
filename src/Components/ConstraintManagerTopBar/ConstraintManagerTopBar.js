import React from 'react';
import { Select, Button } from 'antd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { selectConstraints } from '../../Redux/Constraints/constraints.selectors';

import './ConstraintManagerTopBar.scss';

const ConstraintManagerTopBar = ({
  selectedConstraintConfigurationId,
  onSelect,
  onCreateNew
}) => {
  const constraintConfigurations = useSelector(
    selectConstraints(selectedConstraintConfigurationId)
  ); // Added to test functionality
  return (
    <div className="constraint-manager-top-bar--wrapper">
      <div className="constraint-manager-top-bar--selections">
        <span>Select constraint configuration: </span>
        <Select
          onChange={onSelect}
          defaultValue="Combo Box"
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
        >
          {(constraintConfigurations || []).map((configuration) => (
            <Select.Option key={configuration} value={configuration}>
              {configuration}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="constraint-manager-top-bar--buttons">
        <Button size="small" onClick={onCreateNew}>
          Create new
        </Button>
        <Button size="small" onClick={onCreateNew}>
          Delete
        </Button>
        <Button size="small" onClick={onCreateNew}>
          Save
        </Button>
      </div>
    </div>
  );
};

ConstraintManagerTopBar.propTypes = {
  selectedConstraintConfigurationId: PropTypes.string,
  onSelect: PropTypes.func,
  onCreateNew: PropTypes.func
};

export default ConstraintManagerTopBar;

// Iterate over constraintConfigurations
