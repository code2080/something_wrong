import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

// STYLES
import './ColumnSelector.scss';

const ColumnSelector = ({
  columns,
  onColumnStateChange,
  onHide,
}) => {
  return (
    <div className='column-selector--wrapper'>
      <div className='column-selector--header'>
        <Button type='link' onClick={onHide}>
          <ArrowLeftOutlined />
          Back
        </Button>
        <span className='column-selector--title'>Select columns to display</span>
      </div>
      {columns
        .filter(([_, __, colTitle]) => colTitle !== '')
        .map(([indexor, isVisible, colTitle]) => (<div className='column-selector--col' key={indexor}>
          <Switch
            checked={isVisible}
            onChange={newVisibility => onColumnStateChange({ colIndex: indexor, newVisibility })}
            size='small'
          />
          <span>{colTitle}</span>
        </div>
        ))}
    </div>
  );
};

ColumnSelector.propTypes = {
  columns: PropTypes.array,
  onColumnStateChange: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

ColumnSelector.defaultProps = {
  colums: [],
};

export default ColumnSelector;
