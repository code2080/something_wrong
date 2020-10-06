import React, { useCallback, useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Empty, Button } from 'antd';

// ACTIONS
import { saveActivities } from '../../Redux/Activities/activities.actions';

// SELECTORS
import { selectFormInstanceObjectRequests } from '../../Redux/ObjectRequests/ObjectRequests.selectors';

// HELPERS
import { createActivitiesFromFormInstance } from '../../Utils/activities.helpers';
import { validateMapping } from '../../Redux/ActivityDesigner/activityDesigner.helpers';

// COMPONENTS
import ActivitiesTable from '../../Components/ActivitiesTable/ActivitiesTable';

// CONSTANTS
import { mappingStatuses } from '../../Constants/mappingStatus.constants';

const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId } = ownProps;
  return {
    form: state.forms[formId],
    formInstance: state.submissions[formId][formInstanceId],
    mappings: state.activityDesigner,
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
  mappings,
  saveActivities,
  hasOngoingExternalAction,
  history,
}) => {
  const formInstanceObjReqs = useSelector(selectFormInstanceObjectRequests(formInstance._id))
  const onCreateActivities = useCallback(() => {
    const activities = createActivitiesFromFormInstance(
      formInstance,
      form.sections,
      mapping,
      formInstanceObjReqs,
    );
    saveActivities(formInstance.formId, formInstance._id, activities);
  }, [mapping, formInstance, form, saveActivities]);

  const onCreateActivityDesign = () => history.push(`/forms/${form._id}/activity-designer`);

  const mask = () => {
    if (!hasOngoingExternalAction) return null;

    const els = document.getElementsByClassName(
      'base-activity-col--wrapper is-active'
    );
    if (!els || !els.length || els.length > 1) return null;
    const el = els[0];
    const boundingRect = el.getBoundingClientRect();
    const { width, height } = boundingRect;
    const offset = nodeOffset(el, 'form-instance--wrapper');
    return (
      <div
        className="form-instance-activites--mask"
        style={{
          background: `radial-gradient(closest-side at 
            ${offset.left + width / 2}px 
            ${offset.top + height / 2}px,
            transparent 0px, 
            transparent ${width / 2}px,
            rgba(0, 0, 0, 0.5) ${width / 2 + 15}px)`
        }}
      />
    );
  };

  const renderedState = useMemo(() => {
    /**
     * Case 1: Activities exist
     */
    if (activities && activities.length > 0)
      return (
        <ActivitiesTable
          mapping={mapping}
          activities={activities}
          formInstanceId={formInstance._id}
        />
      );
    // Calculate mapping status
    const mappingStatus = validateMapping(form._id, mappings);

    /**
     * Case 2: Activities don't exist, but mapping does and is valid
     */
    if ((!activities || !activities.length) && mapping && mappingStatus === mappingStatuses.COMPLETE)
      return (
        <div style={{ marginTop: '60px' }}>
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
        </div>
      );

    /**
     * Case 3: Activities don't exist, and mapping either doesn't exist or is invalid
     */
    return (
      <div style={{ marginTop: '60px' }}>
        <Empty
          imageStyle={{
            height: 60
          }}
          description={
            <span>
              This form does not have a completed activity design yet.
            </span>
          }
        >
          <Button type="primary" onClick={onCreateActivityDesign}>
            Create one now
          </Button>
        </Empty>
      </div>
    );
  }, [activities, mapping, onCreateActivities, onCreateActivityDesign]);

  return (
    <div className="form-instance-activities--wrapper">
      {mask()}
      {renderedState}
    </div>
  );
};

FormInstanceReservationOverview.propTypes = {
  formInstance: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  activities: PropTypes.array,
  mapping: PropTypes.object,
  mappings: PropTypes.object,
  saveActivities: PropTypes.func.isRequired,
  hasOngoingExternalAction: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

FormInstanceReservationOverview.defaultProps = {
  activities: [],
  mapping: {}
};

export default withRouter(connect(
  mapStateToProps,
  mapActionsToProps
)(FormInstanceReservationOverview));
