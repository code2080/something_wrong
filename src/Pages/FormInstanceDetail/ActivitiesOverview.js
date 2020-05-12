import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Empty, Button } from 'antd';

// ACTIONS
import { saveActivities } from '../../Redux/Activities/activities.actions';

// HELPERS
import { createActivitiesFromFormInstance } from '../../Utils/activities.helpers';

// COMPONENTS
import ActivitiesTable from '../../Components/ActivitiesTable/ActivitiesTable';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId } = ownProps;
  return {
    form: state.forms[formId],
    formInstance: state.submissions[formId][formInstanceId],
    mapping: state.mappings[formId],
    activities: state.activities[formId] ? (state.activities[formId][formInstanceId] || []) : [],
  };
};

const mapActionsToProps = {
  saveActivities,
};

const FormInstanceReservationOverview = ({
  formInstance,
  form,
  activities,
  mapping,
  saveActivities,
}) => {
  const onCreateActivities = useCallback(() => {
    const activities = createActivitiesFromFormInstance(formInstance, form.sections, mapping);
    saveActivities(formInstance.formId, formInstance._id, activities);
  }, [mapping, formInstance, form, saveActivities]);

  return (
    <div className="form-instance-automatic-scheduling--wrapper">

      {activities && activities.length ? (
        <ActivitiesTable mapping={mapping} activities={activities} />
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
  saveActivities: PropTypes.func.isRequired,
};

FormInstanceReservationOverview.defaultProps = {
  activities: [],
  mapping: {},
};

export default connect(mapStateToProps, mapActionsToProps)(FormInstanceReservationOverview);
