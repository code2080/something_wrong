import React, { useCallback, useMemo, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Empty, Button, Modal } from 'antd';

// ACTIONS
import { deleteActivitiesInFormInstance, saveActivities } from '../../Redux/Activities/activities.actions';

// SELECTORS
import { selectFormInstanceObjectRequests } from '../../Redux/ObjectRequests/ObjectRequests.selectors';

// HELPERS
import { createActivitiesFromFormInstance } from '../../Utils/activities.helpers';
import { validateMapping } from '../../Redux/ActivityDesigner/activityDesigner.helpers';
import { validateScheduledActivities } from '../../Utils/activities.helpers';

// COMPONENTS
import ActivitiesTable from '../../Components/ActivitiesTable/ActivitiesTable';
import withTeCoreAPI from '../../Components/TECoreAPI/withTECoreAPI';

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
  };
};

const mapActionsToProps = {
  saveActivities,
  deleteActivitiesInFormInstance,
};

const FormInstanceReservationOverview = ({
  formInstance,
  form,
  activities,
  mapping,
  mappings,
  saveActivities,
  deleteActivitiesInFormInstance,
  history,
  teCoreAPI,
}) => {
  const dispatch = useDispatch();
  const formInstanceObjReqs = useSelector(selectFormInstanceObjectRequests(formInstance))
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

  useEffect(() => {
    validateScheduledActivities(activities, teCoreAPI, dispatch);
  }, [activities, teCoreAPI, dispatch]);

  const onDeleteAll = () => {
    Modal.confirm({
      getContainer: () => document.getElementById('te-prefs-lib'),
      title: 'Do you want to delete all activities?',
      onOk: () => {
        deleteActivitiesInFormInstance(form._id, formInstance._id);
      },
    });
  };
  
  const renderedState = useMemo(() => {
    /**
     * Case 1: Activities exist
     */
    if (activities && activities.length > 0)
      return (
        <React.Fragment>
          <Button size="small" onClick={onDeleteAll} type="link" style={{ fontSize: '12px' }}>
            Delete all activities for this submission
          </Button>
          <ActivitiesTable
            mapping={mapping}
            activities={activities}
            formInstanceId={formInstance._id}
          />
        </React.Fragment>
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
  deleteActivitiesInFormInstance: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

FormInstanceReservationOverview.defaultProps = {
  activities: [],
  mapping: {}
};

export default withRouter(connect(
  mapStateToProps,
  mapActionsToProps
)(withTeCoreAPI(FormInstanceReservationOverview)));
