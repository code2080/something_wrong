import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Empty, Button } from 'antd';

// ACTIONS
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';
import {
  fetchActivitiesForFormInstance,
  saveActivities,
} from '../../Redux/Activities/activities.actions';

// HELPERS
import { createActivitiesFromFormInstance } from '../../Utils/activities.helpers';

// COMPONENTS
import AutomaticSchedulingTable from '../../Components/AutomaticScheduling/AutomaticSchedulingTable';

// STYLES
import './FormInstanceActivitiesOverview.scss';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId, formInstanceId } } } = ownProps;
  return {
    form: state.forms[formId],
    formInstance: state.submissions[formId][formInstanceId],
    mapping: state.mappings[formId],
    activities: state.activities[formId] ? (state.activities[formId][formInstanceId] || []) : [],
  };
};

const mapActionsToProps = {
  setBreadcrumbs,
  saveActivities,
  fetchActivitiesForFormInstance,
};

const FormInstanceReservationOverview = ({
  formInstance,
  form,
  activities,
  mapping,
  setBreadcrumbs,
  saveActivities,
  fetchActivitiesForFormInstance,
}) => {
  // Effect to update breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      { path: '/forms', label: 'Forms' },
      { path: `/forms/${formInstance.formId}`, label: form.name },
      { path: `/forms/${formInstance.formId}/form-instances/${formInstance._id}`, label: `Submission from ${formInstance.submitter}` },
      { path: `/forms/${formInstance.formId}/form-instances/${formInstance._id}/activities`, label: `Activities` }
    ]);
  }, []);

  // Effect to fetch activities
  useEffect(() => {
    fetchActivitiesForFormInstance(formInstance.formId, formInstance._id);
  }, []);

  const onCreateActivities = useCallback(() => {
    const activities = createActivitiesFromFormInstance(formInstance, form.sections, mapping);
    saveActivities(formInstance.formId, formInstance._id, activities);
  }, [mapping, formInstance, form, saveActivities]);

  return (
    <div className="form-instance-automatic-scheduling--wrapper">

      {activities && activities.length ? (
        <AutomaticSchedulingTable mapping={mapping} activities={activities} />
      ) : (
        <Empty
          imageStyle={{
            height: 60,
          }}
          description={(
            <span>
              This submission has not been converted into activities yet.
            </span>
          )}
        >
          <Button type="primary" onClick={onCreateActivities}>Convert it now</Button>
        </Empty>
      )}
    </div>
  );
};

FormInstanceReservationOverview.propTypes = {
  formInstance: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  activities: PropTypes.array,
  mapping: PropTypes.object,
  setBreadcrumbs: PropTypes.func.isRequired,
  saveActivities: PropTypes.func.isRequired,
  fetchActivitiesForFormInstance: PropTypes.func.isRequired,
};

FormInstanceReservationOverview.defaultProps = {
  activities: [],
  mapping: {},
};

export default connect(mapStateToProps, mapActionsToProps)(FormInstanceReservationOverview);
