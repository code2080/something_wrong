import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Icon } from 'antd';

// ACTIONS
import { toggleRowSchedulingStatus } from '../../../../Redux/ManualSchedulings/manualSchedulings.actions';

// HELPERS
import { pickElement } from '../../../../Utils/elements.helpers';
import { getTECoreAPIPayload } from '../../../../Redux/Integration/integration.selectors';
import withTECoreAPI from '../../../TECoreAPI/withTECoreAPI';

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

const mapStateToProps = (state, ownProps) => {
  // Collect own props
  const { event, sectionId, formId, formInstanceId } = ownProps;
  const rowKey = event.rowKey;

  // Get the payload
  const elementIds = Object.keys(event).filter(key => Array.isArray(event[key]));
  const elements = elementIds.map(eId => pickElement(eId, sectionId, state.forms[formId].sections));
  const teCorePayload = elements.reduce((prev, el) => {
    const value = event[el._id];
    const p = (value || []).map(v => getTECoreAPIPayload(v, el.datasource, state));
    return [...prev, ...p];
  }, []);

  // Get the manual scheduling state
  const rowStatus = _.get(state.manualSchedulings, `${formInstanceId}.${sectionId}.${rowKey}`, manualSchedulingStatuses.NOT_COMPLETED);
  return {
    teCorePayload,
    rowKey,
    rowStatus,
  };
};

const mapActionsToProps = {
  toggleRowSchedulingStatus,
};

const ManualSchedulingColumn = ({
  rowStatus,
  teCorePayload,
  toggleRowSchedulingStatus,
  teCoreAPI,
  formInstanceId,
  sectionId,
  rowKey,
}) => {
  const [showInvertedState, setShowInvertedState] = useState(false);

  const onSelectAllCallback = useCallback(() => {
    if (teCorePayload && Array.isArray(teCorePayload))
      teCoreAPI.populateSelection(teCorePayload);
  }, [teCorePayload]);

  const onToggleRowSchedulingStatusCallback = useCallback(() => {
    toggleRowSchedulingStatus({ formInstanceId, sectionId, rowKey });
  })
  const derivedStatus = getClassName(rowStatus, showInvertedState);

  return (
    <div className="manual-scheduling-column--wrapper">
      {rowStatus === manualSchedulingStatuses.COMPLETED && (
        <div className="manual-scheduling--strikethrough" />
      )}
      <div
        onMouseEnter={() => setShowInvertedState(true)}
        onMouseLeave={() => setShowInvertedState(false)}
        onClick={onToggleRowSchedulingStatusCallback}
        className={`manual-scheduling--status ${derivedStatus}`}
      >
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
  teCoreAPI: PropTypes.object.isRequired,
  teCorePayload: PropTypes.array,
  toggleRowSchedulingStatus: PropTypes.func.isRequired,
  formInstanceId: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  rowKey: PropTypes.string.isRequired,
};

ManualSchedulingColumn.defaultProps = {
  teCorePayload: [],
  rowStatus: manualSchedulingStatuses.NOT_COMPLETED,
};

export default connect(mapStateToProps, mapActionsToProps)(withTECoreAPI(ManualSchedulingColumn));
