import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Empty, Button } from 'antd';

// ACTIONS
import { setBreadcrumbs } from '../Redux/GlobalUI/globalUI.actions';
import {
  fetchReservationsForFormInstance,
  saveReservations,
} from '../Redux/Reservations/reservations.actions';

// HELPERS
import { createReservations } from '../Utils/automaticSchedulingHelpers';

// COMPONENTS
import { withTECoreAPI } from '../Components/TECoreAPI';
import AutomaticSchedulingTable from '../Components/AutomaticScheduling/AutomaticSchedulingTable';

// STYLES
import './FormInstance.scss';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId, formInstanceId } } } = ownProps;
  return {
    form: state.forms[formId],
    formInstance: state.submissions[formId][formInstanceId],
    mappings: state.mappings[formId],
    reservations: state.reservations[formId] ? (state.reservations[formId][formInstanceId] || []) : [],
  };
};

const mapActionsToProps = {
  setBreadcrumbs,
  saveReservations,
  fetchReservationsForFormInstance,
};

const FormInstanceReservationOverview = ({
  formInstance,
  form,
  reservations,
  mappings,
  setBreadcrumbs,
  saveReservations,
  fetchReservationsForFormInstance,
  teCoreAPI,
}) => {
  // Effect to update breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formInstance.formId}`, label: form.name },
      { path: `/forms/${formInstance.formId}/form-instances/${formInstance._id}`, label: `Submission from ${formInstance.submitter}` },
      { path: `/forms/${formInstance.formId}/form-instances/${formInstance._id}/reservations`, label: `Reservation summary` }
    ]);
  }, []);

  // Effect to fetch reservations
  useEffect(() => {
    fetchReservationsForFormInstance(formInstance.formId, formInstance._id);
  }, []);

  // Get mapping
  const [mapping, setMapping] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    async function exec() {
      // Get the selected template name
      const selectedTemplate = await teCoreAPI.getSelectedReservationTemplate();
      setSelectedTemplate(selectedTemplate);
      // Check if we have a mapping for that template
      const mapping = mappings[selectedTemplate];
      setMapping(mapping);
    }
    exec();
  }, [mappings]);

  const onCreateReservations = useCallback(() => {
    const reservations = createReservations(formInstance, form.sections, mapping, selectedTemplate);
    saveReservations(formInstance.formId, formInstance._id, reservations);
  }, [mapping, selectedTemplate, formInstance, form, saveReservations]);

  return (
    <div className="form-instance-automatic-scheduling--wrapper">

      {reservations && reservations.length ? (
        <AutomaticSchedulingTable mapping={mapping} reservations={reservations} />
      ) : (
        <Empty
          imageStyle={{
            height: 60,
          }}
          description={(
            <span>
              This submission has not been converted into reservations yet.
            </span>
          )}
        >
          <Button type="primary" onClick={onCreateReservations}>Convert it now</Button>
        </Empty>
      )}
    </div>
  );
};

FormInstanceReservationOverview.propTypes = {
  formInstance: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  reservations: PropTypes.array,
  mappings: PropTypes.object,
  setBreadcrumbs: PropTypes.func.isRequired,
  saveReservations: PropTypes.func.isRequired,
  fetchReservationsForFormInstance: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
};

FormInstanceReservationOverview.defaultProps = {
  reservations: [],
  mappings: {},
};

export default connect(mapStateToProps, mapActionsToProps)(withTECoreAPI(FormInstanceReservationOverview));
