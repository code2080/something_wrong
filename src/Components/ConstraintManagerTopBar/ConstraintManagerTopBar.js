import React from 'react';
import { Select, Button } from 'antd';
import PropTypes from 'prop-types';
import './ConstraintManagerTopBar.scss';

const ConstraintManagerTopBar = ({
  onSelect,
  onCreateNew,
  constraintConfigurations,
  onDeleteConstraintConfiguration,
  onSaveConstraintConfiguration
}) => {
  return (
    <div className="constraint-manager-top-bar--wrapper">
      <div className="constraint-manager-top-bar--selections">
        <span>Select constraint configuration: </span>
        <Select
          onChange={onSelect}
          defaultValue="Select..."
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
        >
          {constraintConfigurations.map((conf) => (
            <Select.Option key={conf._id} value={conf._id}>
              {conf.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="constraint-manager-top-bar--buttons">
        <Button size="small" onClick={onCreateNew}>
          Create new
        </Button>
        <Button size="small" onClick={onDeleteConstraintConfiguration}>
          Delete
        </Button>
        <Button size="small" onClick={onSaveConstraintConfiguration}>
          Save
        </Button>
      </div>
    </div>
  );
};

ConstraintManagerTopBar.propTypes = {
  constraintConfigurations: PropTypes.array,
  onSelect: PropTypes.func,
  onCreateNew: PropTypes.func,
  onSaveConstraintConfiguration: PropTypes.func,
  onDeleteConstraintConfiguration: PropTypes.func
};

export default ConstraintManagerTopBar;

// Iterate over constraintConfigurations
