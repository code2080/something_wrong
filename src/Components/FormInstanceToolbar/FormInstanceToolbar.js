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
  teCoreAcceptanceStatusProps,
} from '../../Constants/teCoreProps.constants';
import FormInstanceActionsDropdown from './FormInstanceActionsDropdown';
import useFormInstanceSchedulingProcessModal from '../Modals/useFormInstanceSchedulingProcessModal';
import useFormInstanceAcceptanceStatusModal from '../Modals/useFormInstanceAcceptanceStatusModal';

const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId } = ownProps;
  return {
    formInstance: state.submissions[formId][formInstanceId],
    formType: state.forms[formId].formType,
  };
};

const FormInstanceToolbar = ({ formInstance, formType }) => {
  const [
    SchedulingStatusProcessModal,
    openSchedulingStatusProcessModal,
  ] = useFormInstanceSchedulingProcessModal();
  const [
    AcceptanceStatusProcessModal,
    openAcceptanceStatusProcessModal,
  ] = useFormInstanceAcceptanceStatusModal();
  return (
    <div className='toolbar--wrapper'>
      <div className='toolbar--section-flex'>
        <span className='label'>By:</span>
        <span className='value'>{`${formInstance.firstName} ${formInstance.lastName}`}</span>
      </div>
      <div className='toolbar--section-flex'>
        <span className='label'>Primary object:</span>
        <ScopedObject objectExtId={formInstance.scopedObject} />
      </div>
      <div className='toolbar--section-flex'>
        <span className='label'>Form type:</span>
        <span className='value'>{formType.toLowerCase()}</span>
      </div>
      <div className='toolbar--section-flex'>
        <span className='label'>Acceptance status:</span>
        {formInstance.teCoreProps &&
        formInstance.teCoreProps.acceptanceStatus ? (
          <StatusLabel
            color={
              teCoreAcceptanceStatusProps[
                formInstance.teCoreProps.acceptanceStatus
              ].color
            }
            className='no-margin'
            onClick={() =>
              openAcceptanceStatusProcessModal({
                formId: formInstance.formId,
                formInstanceId: formInstance._id,
              })
            }
          >
            {
              teCoreAcceptanceStatusProps[
                formInstance.teCoreProps.acceptanceStatus
              ].label
            }
          </StatusLabel>
        ) : (
          'N/A'
        )}
      </div>
      <div className='toolbar--section-flex'>
        <span className='label'>Scheduling progress:</span>
        {formInstance.teCoreProps &&
        formInstance.teCoreProps.schedulingProgress ? (
          <StatusLabel
            color={
              teCoreSchedulingProgressProps[
                formInstance.teCoreProps.schedulingProgress
              ].color
            }
            className='no-margin'
            onClick={() =>
              openSchedulingStatusProcessModal({
                schedulingProgress: formInstance.teCoreProps.schedulingProgress,
                formInstanceId: formInstance._id,
              })
            }
          >
            {
              teCoreSchedulingProgressProps[
                formInstance.teCoreProps.schedulingProgress
              ].label
            }
          </StatusLabel>
        ) : (
          'N/A'
        )}
      </div>
      <div className='toolbar--section-flex' style={{ marginLeft: 'auto' }}>
        <FormInstanceActionsDropdown formInstance={formInstance} />
      </div>

      {/* MODALS */}
      <SchedulingStatusProcessModal />
      <AcceptanceStatusProcessModal />
    </div>
  );
};

FormInstanceToolbar.propTypes = {
  formInstance: PropTypes.object.isRequired,
  formType: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, null)(FormInstanceToolbar);
