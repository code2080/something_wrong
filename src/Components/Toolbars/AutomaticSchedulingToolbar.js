import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'antd';

// HELPERS
import { validateMapping } from '../../Redux/Mapping/mappings.helpers';
import { getActivitiesForFormInstance } from '../../Redux/Activities/activities.helpers';

// COMPONENTS
import SchedulingProgress from '../AutomaticScheduling/SchedulingProgress';

// STYLES
import './Toolbar.scss';

// CONSTANTS
import { mappingStatuses } from '../../Constants/mappingStatus.constants';

const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId } = ownProps;
  return {
    formInstance: state.submissions[formId][formInstanceId],
    mappings: state.mappings,
    activities: getActivitiesForFormInstance(state.activities, formId, formInstanceId),
  };
};

const AutomaticSchedulingToolbar = ({
  formId,
  formInstance,
  mappings,
  activities,
  history,
}) => {
  const mappingStatus = useMemo(() => validateMapping(formId, mappings), [formId, mappings]);

  const onConfigureMappingCallback = useCallback(() => {
    history.push(`/forms/${formInstance.formId}/mapping`);
  }, [formInstance, history]);

  const onConvertToReservations = useCallback(() => {
    history.push(`/forms/${formInstance.formId}/form-instances/${formInstance._id}/activities`);
  }, [formInstance, history]);

  const onScheduleReservations = useCallback(() => {
    console.log('Should schedule all outstanding activities');
  }, []);

  return (
    <div className="toolbar--wrapper">
      {mappingStatus === mappingStatuses.NOT_SET && (
        <div className="toolbar--section-flex">
          <span className="label">Almost ready for automatic scheduling!</span>
          <Button type="link" size="small" onClick={onConfigureMappingCallback}>
            Configure the form's mapping to the activity template to get started
          </Button>
        </div>
      )}
      {mappingStatus === mappingStatuses.COMPLETE && activities.length > 0 && (
        <React.Fragment>
          <div className="toolbar--section-flex">
            <span className="label">Ready for automatic scheduling!</span>
            <Button type="link" size="small" onClick={onConvertToReservations}>
              View activity summary
            </Button>
          </div>
          <div className="toolbar--section-flex">
            <span className="label">Progress</span>
            <SchedulingProgress formId={formInstance.formId} formInstanceId={formInstance._id} />
          </div>
          <div className="toolbar--section-flex adjust-right">
            <Button size="small" onClick={onScheduleReservations}>
              Schedule all activities
            </Button>
          </div>
        </React.Fragment>
      )}
      {mappingStatus === mappingStatuses.COMPLETE && !activities.length && (
        <div className="toolbar--section-flex">
          <span className="label">Ready for automatic scheduling!</span>
          <Button type="link" size="small" onClick={onConvertToReservations}>
            Convert submissions to activities to get started
          </Button>
        </div>
      )}
    </div>
  );
};

AutomaticSchedulingToolbar.propTypes = {
  formId: PropTypes.string.isRequired,
  formInstance: PropTypes.object.isRequired,
  mappings: PropTypes.object,
  activities: PropTypes.array,
  history: PropTypes.object.isRequired,
};

AutomaticSchedulingToolbar.defaultProps = {
  mappings: null,
  activities: [],
};

export default withRouter(connect(mapStateToProps, null)(AutomaticSchedulingToolbar));
