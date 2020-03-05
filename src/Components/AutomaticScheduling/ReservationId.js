import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';

// COMPONENTS
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

const ReservationId = ({ reservationId, teCoreAPI }) => {
  const onSelectReservation = useCallback(() => {
    if (reservationId)
      teCoreAPI.selectReservation(reservationId);
  }, [teCoreAPI, reservationId]);

  return (
    <Tooltip
      title={reservationId ? 'Click to select activity' : 'This activity has not been scheduled yet'}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <div
        className={`activity-id--wrapper ${!reservationId && 'disabled'}`}
        onClick={onSelectReservation}
      >
        <Icon type="select" />
      </div>
    </Tooltip>
  );
};

ReservationId.propTypes = {
  reservationId: PropTypes.string,
  teCoreAPI: PropTypes.object.isRequired,
};

ReservationId.defaultProps = {
  reservationId: null,
};

export default withTECoreAPI(ReservationId);
