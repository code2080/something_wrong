import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Progress } from 'antd';

// HELPERS
import { getActivitiesForFormInstance } from '../../Redux/Activities/activities.helpers';

// CONSTANTS
import { activityStatuses } from '../../Constants/activityStatuses.constants';

const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId } = ownProps;
  return {
    activities: getActivitiesForFormInstance(state.activities, formId, formInstanceId),
  };
};

const SchedulingProgress = ({ activities }) => {
  const [percentCompleted, statusText] = useMemo(() => {
    const completedReservations = activities.filter(el => el.activityStatus !== activityStatuses.NOT_SCHEDULED);
    return [
      ((completedReservations || []).length / (activities || []).length) * 100,
      `${(completedReservations || []).length}/${(activities || []).length} activities scheduled`,
    ];
  }, [activities]);

  return (
    <Progress
      size="small"
      style={{ width: '10rem' }}
      percent={percentCompleted}
      format={() => statusText}
    />
  );
};

SchedulingProgress.propTypes = {
  activities: PropTypes.array,
};

SchedulingProgress.defaultProps = {
  activities: [],
};

export default connect(mapStateToProps, null)(SchedulingProgress);
