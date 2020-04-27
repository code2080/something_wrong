import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';

// STYLES
import './ManualSchedulingColumn.scss';

// CONSTANTS
import { manualSchedulingStatuses } from '../../../../Constants/manualSchedulingConstants';

const getClassName = (rowStatus, showInvertedState) => {
  if (showInvertedState) {
    if (rowStatus === manualSchedulingStatuses.COMPLETED) return manualSchedulingStatuses.NOT_COMPLETED;
    return manualSchedulingStatuses.COMPLETED;
  } else {
    return rowStatus;
  }
};

const mapStateToProps = (state, ownProps) => ({});

const ManualSchedulingColumn = ({
  rowStatus,
}) => {
  const [showInvertedState, setShowInvertedState] = useState(false);

  const onSelectAllCallback = useCallback(() => {
    console.log('should select all objects in the row and send to core')
  }, []);

  const derivedStatus = getClassName(rowStatus, showInvertedState);

  return (
    <div
      onMouseEnter={() => setShowInvertedState(true)}
      onMouseLeave={() => setShowInvertedState(false)}
      className="manual-scheduling-column--wrapper"
    >
      <div className={`manual-scheduling--status ${derivedStatus}`}>
        {derivedStatus === manualSchedulingStatuses.NOT_COMPLETED && (
          <Icon type="minus-square" />
        )}
        {derivedStatus === manualSchedulingStatuses.COMPLETED && (
          <Icon type="check-square" />
        )}
      </div>
      <div className="manual-scheduling--button" onClick={onSelectAllCallback}>
        <Icon type="select" />
      </div>
    </div>
  );
};

ManualSchedulingColumn.propTypes = {
  rowStatus: PropTypes.string,
};

ManualSchedulingColumn.defaultProps = {
  rowStatus: manualSchedulingStatuses.NOT_COMPLETED,
};

export default connect(mapStateToProps, null)(ManualSchedulingColumn);
