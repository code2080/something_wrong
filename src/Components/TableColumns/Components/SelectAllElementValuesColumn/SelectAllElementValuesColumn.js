import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Icon } from 'antd';

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
import { selectFormInstanceObjectRequests } from '../../../../Redux/ObjectRequests/ObjectRequests.selectors';

// STYLES
import './SelectAllElementValuesColumn.scss';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  // Collect own props
  const { event, sectionId, formId, formInstanceId } = ownProps;
  const form = state.forms[formId];
  const formInstance = state.submissions[formId][formInstanceId];
  const selectionSettings = getSelectionSettings(sectionId, formInstance);
  const formInstanceObjectRequests = selectFormInstanceObjectRequests(formInstance)(state);

  // Get the payload
  const elementIds = Object.keys(event).filter(key => Array.isArray(event[key]));
  const elements = elementIds.map(eId => pickElement(eId, sectionId, state.forms[formId].sections));
  const teCorePayload = {
    startTime: event.startTime || event.start || null,
    endTime: event.endTime || event.end || null,
    typedObjects: _.compact([
      ...elements.reduce((prev, el) => {
        const value = event[el._id];
        const p = (value || []).map(v => getTECoreAPIPayload(v, el.datasource, formInstanceObjectRequests));
        return [...prev, ...p];
      }, []),
      ...getSelectionSettingsTECorePayload(selectionSettings, form, formInstance, event),
    ]),
    formType: form.formType,
    reservationMode: form.reservationMode,
  };

  return {
    teCorePayload,
  };
};

const mapActionsToProps = {
  toggleRowSchedulingStatus,
  setFormInstanceSchedulingProgress,
  selectFormInstanceObjectRequests,
};

const ManualSchedulingColumn = ({ teCorePayload, teCoreAPI }) => {
  const onSelectAllCallback = useCallback(() => {
    if (teCorePayload)
      teCoreAPI.populateSelection(teCorePayload);
  }, [teCorePayload]);

  return (
    <div className="manual-scheduling-column--wrapper">
      <div className="manual-scheduling--button" onClick={onSelectAllCallback}>
        <Icon type="select" />
      </div>
    </div>
  );
};

ManualSchedulingColumn.propTypes = {
  teCoreAPI: PropTypes.object.isRequired,
  teCorePayload: PropTypes.object,
};

ManualSchedulingColumn.defaultProps = {
  teCorePayload: {
    typedObjects: [],
    formType: 'REGULAR',
    reservationMode: null,
  },
};

export default connect(mapStateToProps, mapActionsToProps)(withTECoreAPI(ManualSchedulingColumn));
