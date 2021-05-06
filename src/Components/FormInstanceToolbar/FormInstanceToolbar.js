import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

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
import { makeSelectFormInstance } from '../../Redux/FormSubmissions/formSubmissions.selectors';
import { useMemo } from 'react';
import { makeSelectForm } from '../../Redux/Forms/forms.selectors';

const FormInstanceToolbar = ({ formId, formInstanceId }) => {
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const selectForm = useMemo(() => makeSelectForm(), []);

  const formInstance = useSelector((state) =>
    selectFormInstance(state, { formId, formInstanceId }),
  );
  const { formType } = useSelector((state) => selectForm(state, formId));

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
  formInstanceId: PropTypes.string.isRequired,
  formId: PropTypes.string.isRequired,
};

export default FormInstanceToolbar;
