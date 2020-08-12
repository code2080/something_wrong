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
    mapping: state.activityDesigner[formId],
    activities: state.activities[formId] ? (state.activities[formId][formInstanceId] || []) : [],
    hasOngoingExternalAction: state.globalUI.externalAction != null,
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
  hasOngoingExternalAction,
}) => {
  const onCreateActivities = useCallback(() => {
    const activities = createActivitiesFromFormInstance(formInstance, form.sections, mapping);
    saveActivities(formInstance.formId, formInstance._id, activities);
  }, [mapping, formInstance, form, saveActivities]);

  const mask = () => {
    if (!hasOngoingExternalAction) return null;

    const els = document.getElementsByClassName('base-activity-col--wrapper is-active');
    if (!els || !els.length || els.length > 1) return null;
    const el = els[0];
    const boundingRect = el.getBoundingClientRect();
    const { x, y, width, height } = boundingRect;
    return (
      <div
        className="form-instance-activites--mask"
        style={{
          background: `radial-gradient(${width}px ${height}px at ${x + width / 2}px ${y - height / 4}px, transparent 0px, transparent 70%, rgba(0, 0, 0, 0.5) 80%)`,
        }}
      />
    );
  };

  return (
    <div className="form-instance-activities--wrapper">
      {mask()}
      {activities && activities.length ? (
        <ActivitiesTable mapping={mapping} activities={activities} formInstanceId={formInstance._id} />
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
  hasOngoingExternalAction: PropTypes.bool.isRequired,
};

FormInstanceReservationOverview.defaultProps = {
  activities: [],
  mapping: {},
};

export default connect(mapStateToProps, mapActionsToProps)(FormInstanceReservationOverview);
