import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// COMPONENTS
import { useMemo } from 'react';
import ScopedObject from '../FormToolbar/ScopedObject';
import StatusLabel from '../StatusLabel/StatusLabel';
import ObjectRequestDropdown from '../Elements/DatasourceInner/ObjectRequestDropdown';

// STYLES
import '../../Styles/Toolbar.scss';

// CONSTANTS
import {
  teCoreSchedulingProgressProps,
  teCoreAcceptanceStatusProps,
} from '../../Constants/teCoreProps.constants';
import useFormInstanceSchedulingProcessModal from '../Modals/useFormInstanceSchedulingProcessModal';
import useFormInstanceAcceptanceStatusModal from '../Modals/useFormInstanceAcceptanceStatusModal';
import { makeSelectFormInstance } from '../../Redux/FormSubmissions/formSubmissions.selectors';
import { makeSelectForm } from '../../Redux/Forms/forms.selectors';
import FormInstanceActionsDropdown from './FormInstanceActionsDropdown';

const FormInstanceToolbar = ({ formId, formInstanceId, objectRequests }) => {
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const selectForm = useMemo(() => makeSelectForm(), []);

  const formInstance = useSelector((state) =>
    selectFormInstance(state, { formId, formInstanceId }),
  );
  const { formType } = useSelector((state) => selectForm(state, formId));

  const [SchedulingStatusProcessModal, openSchedulingStatusProcessModal] =
    useFormInstanceSchedulingProcessModal();
  const [AcceptanceStatusProcessModal, openAcceptanceStatusProcessModal] =
    useFormInstanceAcceptanceStatusModal();
  const request = objectRequests.find(
    (request: any) => request._id === formInstance.scopedObject,
  );

  return (
    <div className='toolbar--wrapper'>
      <div className='toolbar--section-flex'>
        <span className='label'>By:</span>
        <span className='value'>{`${formInstance.firstName} ${formInstance.lastName}`}</span>
      </div>
      <div className='toolbar--section-flex'>
        <span className='label'>Primary object:</span>
        {request ? (
          <ObjectRequestDropdown request={request} />
        ) : (
          <ScopedObject objectExtId={formInstance.scopedObject} />
        )}
      </div>
      <div className='toolbar--section-flex'>
        <span className='label'>Form type:</span>
        <span className='value'>{formType?.toLowerCase() ?? 'N/A'}</span>
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
  objectRequests: PropTypes.array,
};

export default FormInstanceToolbar;
