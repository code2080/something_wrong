import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// COMPONENTS
import ScopedObject from '../FormToolbar/ScopedObject';
import StatusLabel from '../StatusLabel/StatusLabel';

// STYLES
import '../../Styles/Toolbar.scss';

// CONSTANTS
import {
  teCoreSchedulingProgressProps,
  teCoreAcceptanceStatusProps
} from '../../Constants/teCoreProps.constants';
import { Button } from 'antd';
import FormInstanceActionsDropdown from './FormInstanceActionsDropdown';

const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId } = ownProps;
  return {
    formInstance: state.submissions[formId][formInstanceId],
    formType: state.forms[formId].formType,
  };
};

const FormInstanceToolbar = ({
  formInstance,
  formType,
  onClickMore,
}) => {
  return (
    <div className="toolbar--wrapper">
      <div className="toolbar--section-flex">
        <span className="label">By:</span>
        <span className="value">{`${formInstance.firstName} ${formInstance.lastName}`}</span>
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Scoped object:</span>
        <ScopedObject objectExtId={formInstance.scopedObject} />
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Form type:</span>
        <span className="value">{formType.toLowerCase()}</span>
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Acceptance status:</span>
        {formInstance.teCoreProps && formInstance.teCoreProps.acceptanceStatus ? (
          <StatusLabel
            color={teCoreAcceptanceStatusProps[formInstance.teCoreProps.acceptanceStatus].color}
            className="no-margin"
          >
            {teCoreAcceptanceStatusProps[formInstance.teCoreProps.acceptanceStatus].label}
          </StatusLabel>
        ) : 'N/A' }
      </div>
      <div className="toolbar--section-flex">
        <span className="label">Scheduling progress:</span>
        {formInstance.teCoreProps && formInstance.teCoreProps.schedulingProgress ? (
          <StatusLabel
            color={teCoreSchedulingProgressProps[formInstance.teCoreProps.schedulingProgress].color}
            className="no-margin"
          >
            {teCoreSchedulingProgressProps[formInstance.teCoreProps.schedulingProgress].label}
          </StatusLabel>
        ) : 'N/A' }
      </div>
      <div className="toolbar--section-flex">
        <a onClick={() => onClickMore()}>Form info...</a>
      </div>
      <div class="toolbar--section-flex" style={{ marginLeft: 'auto' }}>
        <FormInstanceActionsDropdown formInstance={formInstance} />
      </div>
    </div>
  );
};

FormInstanceToolbar.propTypes = {
  formInstance: PropTypes.object.isRequired,
  formType: PropTypes.string.isRequired,
  onClickMore: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  null
)(FormInstanceToolbar);
