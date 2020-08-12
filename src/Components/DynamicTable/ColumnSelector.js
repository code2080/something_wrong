import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Switch, Button, Icon } from 'antd';

// STYLES
import './ColumnSelector.scss';

const ColumnSelector = ({
  columnState,
  onColumnStateChange,
  onHide,
}) => {
  const onColumnStateChangeCallback = useCallback(
    ({ colName, visible }) => onColumnStateChange({ ...columnState, [colName]: visible })
    , [columnState]);

  return (
    <div className="column-selector--wrapper">
      <div className="column-selector--header">
        <Button type="link" onClick={onHide}>
          <Icon type="arrow-left" />
          Back
        </Button>
        <span className="column-selector--title">Select columns to display</span>
      </div>
      {(Object.keys(columnState) || [])
        .filter(col => col && col !== '')
        .map(col => (
          <div className="column-selector--col" key={col}>
            <Switch
              checked={columnState[col]}
              onChange={visible => onColumnStateChangeCallback({ colName: col, visible })}
              size="small"
            />
            <span>{col}</span>
          </div>
        ))}
    </div>
  );
};

ColumnSelector.propTypes = {
  columnState: PropTypes.object,
  onColumnStateChange: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};

ColumnSelector.defaultProps = {
  columnState: {},
};

export default ColumnSelector;
