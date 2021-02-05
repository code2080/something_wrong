import React, { useCallback, useMemo, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Empty, Button, Modal } from 'antd';

// ACTIONS
import { deleteActivitiesInFormInstance, saveActivities } from '../../Redux/Activities/activities.actions';

// HELPERS
import { validateScheduledActivities } from '../../Utils/activities.helpers';
import { validateDesign } from '../../Redux/ActivityDesigner/activityDesigner.helpers';

// COMPONENTS
import ActivitiesTable from '../../Components/ActivitiesTable/ActivitiesTable';
import withTeCoreAPI from '../../Components/TECoreAPI/withTECoreAPI';

// CONSTANTS
import { mappingStatuses } from '../../Constants/mappingStatus.constants';

// HOOKS
import { useMixpanel } from '../../Hooks/TECoreApiHooks';
import { abortJob } from '../../Redux/Jobs/jobs.actions';
import { selectJobForActivities } from '../../Redux/Jobs/jobs.selectors';

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
};

const FormInstanceReservationOverview = ({
  formInstance,
  form,
  activities,
  mapping,
  mappings,
  saveActivities,
  history,
  teCoreAPI,
}) => {
  const mixpanel = useMixpanel();
  const dispatch = useDispatch();
  const jobs = useSelector(selectJobForActivities(formInstance.formId, activities.map(item => item._id)));

  const onCreateActivities = useCallback(() => {
    saveActivities(formInstance.formId, formInstance._id, ({ data }) => {
      mixpanel.track('PrefsInCore, onCreateActivities', { numberOfActivities: data.activities.length });
    });
  }, [mapping, formInstance, form, saveActivities]);

  const onCreateActivityDesign = () => history.push(`/forms/${form._id}/activity-designer`);

  useEffect(() => {
    validateScheduledActivities(activities, teCoreAPI, dispatch);
  }, [activities, teCoreAPI, dispatch]);

  const onDeleteAll = () => {
    Modal.confirm({
      getContainer: () => document.getElementById('te-prefs-lib'),
      title: 'Do you want to delete all activities?',
      onOk: async () => {
        const res = await dispatch(deleteActivitiesInFormInstance(form._id, formInstance._id));
        // STOP JOBS AFTER REMOVED ALL ACTIVITIES
        if (res.status === 200) {
          if (jobs && jobs.length) {
            jobs.forEach(job => {
              dispatch(abortJob({
                jobId: job._id,
                formId: formInstance.formId,
                formInstanceId: formInstance._id,
                activities: job.activities,
              }));
            })
          }
        }
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
            formId={form._id}
          />
        </React.Fragment>
      );
    // Calculate mapping status
    const mappingStatus = validateDesign(form._id, mappings);

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
  history: PropTypes.object.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
};

FormInstanceReservationOverview.defaultProps = {
  activities: [],
  mapping: {}
};

export default withRouter(connect(
  mapStateToProps,
  mapActionsToProps
)(withTeCoreAPI(FormInstanceReservationOverview)));
