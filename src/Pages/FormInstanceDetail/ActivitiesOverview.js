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
    activities: state.activities[formId]
      ? state.activities[formId][formInstanceId] || []
      : [],
    hasOngoingExternalAction: state.globalUI.externalAction != null
  };
};

const mapActionsToProps = {
  saveActivities
};

const nodeOffset = (node, stopAtClassName) => {
  let top = 0;
  let left = 0;
  let currentNode = node;

  while (currentNode !== null && currentNode.className !== stopAtClassName) {
    top +=
      currentNode.offsetTop - currentNode.scrollTop + currentNode.clientTop;
    left +=
      currentNode.offsetLeft - currentNode.scrollLeft + currentNode.clientLeft;
    currentNode = currentNode.offsetParent;
  }
  return { top, left };
};

const FormInstanceReservationOverview = ({
  formInstance,
  form,
  activities,
  mapping,
  saveActivities,
  hasOngoingExternalAction
}) => {
  const onCreateActivities = useCallback(() => {
    const activities = createActivitiesFromFormInstance(
      formInstance,
      form.sections,
      mapping
    );
    saveActivities(formInstance.formId, formInstance._id, activities);
  }, [mapping, formInstance, form, saveActivities]);

  const mask = () => {
    if (!hasOngoingExternalAction) return null;

    const els = document.getElementsByClassName(
      'base-activity-col--wrapper is-active'
    );
    if (!els || !els.length || els.length > 1) return null;
    const el = els[0];
    const boundingRect = el.getBoundingClientRect();
    const { top, left, width, height } = boundingRect;
    const offset = nodeOffset(el, 'form-instance--wrapper');
    return (
      <div
        className="form-instance-activites--mask"
        style={{
          background: `radial-gradient(at ${offset.left +
            width / 2 -
            20}px ${offset.top +
            height / 2}px, transparent 0px, transparent ${width /
            2}px, rgba(0, 0, 0, 0.5) ${width / 2 + 15}px)`
        }}
      />
    );
  };

  return (
    <div className="form-instance-activities--wrapper">
      {mask()}
      {activities && activities.length ? (
        <ActivitiesTable
          mapping={mapping}
          activities={activities}
          formInstanceId={formInstance._id}
        />
      ) : (
        <Empty
          imageStyle={{
            height: 60
          }}
          description={
            <span>
              This submission has not been converted into activities yet.
            </span>
          }
        >
          <Button type="primary" onClick={onCreateActivities}>
            Convert it now
          </Button>
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
  hasOngoingExternalAction: PropTypes.bool.isRequired
};

FormInstanceReservationOverview.defaultProps = {
  activities: [],
  mapping: {}
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(FormInstanceReservationOverview);
