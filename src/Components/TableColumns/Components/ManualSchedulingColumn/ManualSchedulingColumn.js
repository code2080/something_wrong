import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';

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
  const { event, sectionId, formId } = ownProps;
  const elementIds = Object.keys(event).filter(key => Array.isArray(event[key]));
  const elements = elementIds.map(eId => pickElement(eId, sectionId, state.forms[formId].sections));
  const teCorePayload = elements.reduce((prev, el) => {
    const value = event[el._id];
    const p = (value || []).map(v => getTECoreAPIPayload(v, el.datasource, state));
    return [...prev, ...p];
  }, []);
  return {
    teCorePayload,
  };
}

const ManualSchedulingColumn = ({
  rowStatus,
  teCorePayload,
  teCoreAPI,
}) => {
  const [showInvertedState, setShowInvertedState] = useState(false);

  const onSelectAllCallback = useCallback(() => {
    if (teCorePayload && Array.isArray(teCorePayload))
      teCoreAPI.populateSelection(teCorePayload);
  }, [teCorePayload]);

  const derivedStatus = getClassName(rowStatus, showInvertedState);

  return (
    <div className="manual-scheduling-column--wrapper">
      <div
        onMouseEnter={() => setShowInvertedState(true)}
        onMouseLeave={() => setShowInvertedState(false)}
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
};

ManualSchedulingColumn.defaultProps = {
  teCorePayload: [],
  rowStatus: manualSchedulingStatuses.NOT_COMPLETED,
};

export default connect(mapStateToProps, null)(withTECoreAPI(ManualSchedulingColumn));
