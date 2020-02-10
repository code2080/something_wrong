import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Progress } from 'antd';

// HELPERS
import { getReservationsForFormInstance } from '../../Redux/Reservations/reservations.helpers';

// CONSTANTS
import { reservationStatuses } from '../../Constants/reservationStatuses.constants.js';

const mapStateToProps = (state, ownProps) => {
  const { formId, formInstanceId } = ownProps;
  return {
    reservations: getReservationsForFormInstance(state.reservations, formId, formInstanceId),
  };
};

const SchedulingProgress = ({ reservations }) => {
  const [percentCompleted, statusText] = useMemo(() => {
    const completedReservations = reservations.filter(el => el.reservationStatus !== reservationStatuses.NOT_SCHEDULED);
    return [
      ((completedReservations || []).length / (reservations || []).length) * 100,
      `${(completedReservations || []).length}/${(reservations || []).length} reservations scheduled`,
    ];
  }, [reservations]);

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
  reservations: PropTypes.array,
};

SchedulingProgress.defaultProps = {
  reservations: [],
};

export default connect(mapStateToProps, null)(SchedulingProgress);
