import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// HELPERS
import { getReservationForEvent } from '../../Redux/Activities/activities.helpers';

// COMPONENTS
import ReservationStatus from './ActivityStatus';
import ReservationId from './ReservationId';
import ActivityActionsDropdown from './ActivityActionsDropdown';

// STYLES
import './ConnectedSectionSchedulingColumn.scss';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  const { event, sectionId, formInstanceId, formId } = ownProps;
  const activity = getReservationForEvent(state.activities, formId, formInstanceId, sectionId, event.rowKey);
  return {
    activity,
  };
};

const ConnectedSectionSchedulingColumn = ({
  activity,
}) => {
  if (!activity) return 'N/A';
  return (
    <div className="scheduling-column--wrapper">
      <ReservationStatus activityStatus={activity.activityStatus} reservationId={activity.reservationId} />
      <ReservationId reservationId={activity.reservationId} />
      <ActivityActionsDropdown buttonType="link" activity={activity} />
    </div>
  );
};

ConnectedSectionSchedulingColumn.propTypes = {
  activity: PropTypes.object,
};

ConnectedSectionSchedulingColumn.defaultProps = {
  activity: null,
};

export default connect(mapStateToProps, null)(ConnectedSectionSchedulingColumn);
