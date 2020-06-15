import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Icon, Modal } from 'antd';

// ACTIONS
import { toggleRowSchedulingStatus } from '../../../../Redux/ManualSchedulings/manualSchedulings.actions';
import { setFormInstanceSchedulingProgress } from '../../../../Redux/FormSubmissions/formSubmissions.actions';

// HELPERS
import { pickElement } from '../../../../Utils/elements.helpers';
import { getTECoreAPIPayload } from '../../../../Redux/Integration/integration.selectors';
import withTECoreAPI from '../../../TECoreAPI/withTECoreAPI';
import { getSelectionSettings } from '../../../../Utils/sections.helpers';
import { getSelectionSettingsTECorePayload } from '../../../../Utils/forms.helpers';
// SELECTORS
import { selectManualSchedulingStatusForRow, selectManualSchedulingStatus } from '../../../../Redux/ManualSchedulings/manualSchedulings.selectors';

// STYLES
import './ManualSchedulingColumn.scss';

// CONSTANTS
import { manualSchedulingStatuses, manualSchedulingFormStatuses } from '../../../../Constants/manualSchedulingConstants';
import { teCoreSchedulingProgress } from '../../../../Constants/teCoreProps.constants';

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
  const form = state.forms[formId];
  const formInstance = state.submissions[formId][formInstanceId];
  const selectionSettings = getSelectionSettings(sectionId, formInstance);

  // Get the payload
  const elementIds = Object.keys(event).filter(key => Array.isArray(event[key]));
  const elements = elementIds.map(eId => pickElement(eId, sectionId, state.forms[formId].sections));
  const teCorePayload = [
    ...elements.reduce((prev, el) => {
      const value = event[el._id];
      const p = (value || []).map(v => getTECoreAPIPayload(v, el.datasource, state));
      return [...prev, ...p];
    }, []),
    ...getSelectionSettingsTECorePayload(selectionSettings, form, formInstance, event),
  ];

  return {
    teCorePayload,
    rowKey,
    rowStatus: selectManualSchedulingStatusForRow(state)(formInstanceId, sectionId, rowKey),
    mSStatus: selectManualSchedulingStatus(state)(formInstanceId, formId),
    formInstance: _.get(state, `submissions.${formId}.${formInstanceId}`, {}),
  };
};

const mapActionsToProps = {
  toggleRowSchedulingStatus,
  setFormInstanceSchedulingProgress,
};

const ManualSchedulingColumn = ({
  rowStatus,
  teCorePayload,
  toggleRowSchedulingStatus,
  setFormInstanceSchedulingProgress,
  teCoreAPI,
  formInstanceId,
  sectionId,
  rowKey,
  formInstance,
  mSStatus,
}) => {
  const [showInvertedState, setShowInvertedState] = useState(false);

  const onSelectAllCallback = useCallback(() => {
    if (teCorePayload && Array.isArray(teCorePayload))
      teCoreAPI.populateSelection(teCorePayload);
  }, [teCorePayload]);

  const onToggleRowSchedulingStatusCallback = useCallback(() => {
    if (mSStatus.status === manualSchedulingFormStatuses.NOT_STARTED && formInstance.teCoreProps.schedulingProgress === teCoreSchedulingProgress.NOT_SCHEDULED)
      Modal.confirm({
        getContainer: () => document.getElementById('te-prefs-lib'),
        title: 'Do you want to update the scheduling progress?',
        content: 'You just marked the first row of this submission as scheduled. Do you want to update the scheduling status to in progress?',
        onOk: () => setFormInstanceSchedulingProgress({ formInstanceId, schedulingProgress: teCoreSchedulingProgress.IN_PROGRESS }),
        onCancel: () => {},
      });
    if (mSStatus.status === manualSchedulingFormStatuses.ONE_AWAY && formInstance.teCoreProps.schedulingProgress !== teCoreSchedulingProgress.SCHEDULING_FINISHED)
      Modal.confirm({
        getContainer: () => document.getElementById('te-prefs-lib'),
        title: 'Do you want to update the scheduling progress?',
        content: 'You just marked the last row of this submission as scheduled. Do you want to update the scheduling status to completed?',
        onOk: () => setFormInstanceSchedulingProgress({ formInstanceId, schedulingProgress: teCoreSchedulingProgress.SCHEDULING_FINISHED }),
        onCancel: () => {},
      });

    toggleRowSchedulingStatus({ formInstanceId, sectionId, rowKey });
  }, [mSStatus, toggleRowSchedulingStatus, formInstanceId, sectionId, rowKey])
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
  mSStatus: PropTypes.object.isRequired,
  setFormInstanceSchedulingProgress: PropTypes.func.isRequired,
  formInstance: PropTypes.object.isRequired,
};

ManualSchedulingColumn.defaultProps = {
  teCorePayload: [],
  rowStatus: manualSchedulingStatuses.NOT_COMPLETED,
};

export default connect(mapStateToProps, mapActionsToProps)(withTECoreAPI(ManualSchedulingColumn));
