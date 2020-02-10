import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// HELPERS
import { getReservationForEvent } from '../../Redux/Reservations/reservations.helpers';

// COMPONENTS
import ReservationStatus from './ReservationStatus';
import ReservationId from './ReservationId';
import ReservationActionsDropdown from './ReservationActionsDropdown';

// STYLES
import './ConnectedSectionSchedulingColumn.scss';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  const { event, sectionId, formInstanceId, formId } = ownProps;
  const reservation = getReservationForEvent(state.reservations, formId, formInstanceId, sectionId, event.rowKey);
  return {
    reservation,
  };
};

const ConnectedSectionSchedulingColumn = ({
  reservation,
}) => {
  if (!reservation) return 'N/A';
  return (
    <div className="scheduling-column--wrapper">
      <ReservationStatus reservationStatus={reservation.reservationStatus} reservationId={reservation.reservationId} />
      <ReservationId reservationId={reservation.reservationId} />
      <ReservationActionsDropdown buttonType="link" reservation={reservation} />
    </div>
  );
};

ConnectedSectionSchedulingColumn.propTypes = {
  reservation: PropTypes.object,
};

ConnectedSectionSchedulingColumn.defaultProps = {
  reservation: null,
};

export default connect(mapStateToProps, null)(ConnectedSectionSchedulingColumn);
