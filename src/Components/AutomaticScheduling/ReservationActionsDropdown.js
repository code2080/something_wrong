import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Menu, Button, Icon } from 'antd';

// ACTIONS
import { scheduleReservation } from '../../Redux/Reservations/reservations.actions';

// COMPONENTS
import withTECoreAPI from '../TECoreAPI/withTECoreAPI';

// CONSTANTS
import { reservationStatuses } from '../../Constants/reservationStatuses.constants';

const mapActionsToProps = {
  scheduleReservation,
};

const reservationActions = {
  SCHEDULE: {
    label: 'Schedule reservation',
    filterFn: reservation => !reservation.reservationId && reservation.reservationStatus === reservationStatuses.NOT_SCHEDULED,
  },
  SELECT: {
    label: 'Select reservation',
    filterFn: reservation => reservation.reservationId && reservation.reservationStatus !== reservationStatuses.NOT_SCHEDULED,
    callname: 'selectReservation',
  },
  DELETE: {
    label: 'Delete reservation',
    filterFn: reservation => reservation.reservationId && reservation.reservationStatus !== reservationStatuses.NOT_SCHEDULED,
    callname: 'deleteReservation',
  },
}

const ReservationActionsDropdown = ({
  buttonType,
  reservation,
  scheduleReservation,
  teCoreAPI,
}) => {
  const handleMenuClick = useCallback(({ key }) => {
    if (reservationActions[key] && reservationActions[key].callname)
      teCoreAPI[reservationActions[key].callname](reservation);

    if (key === 'SCHEDULE') {
      scheduleReservation({ api: teCoreAPI, reservation });
    }
  }, [teCoreAPI, reservation]);

  const menu = useMemo(() => (
    <Menu onClick={handleMenuClick}>
      {Object.keys(reservationActions)
        .filter(key => reservationActions[key].filterFn(reservation))
        .map(key => (
          <Menu.Item key={key}>{reservationActions[key].label}</Menu.Item>
        ))}
    </Menu>
  ), [handleMenuClick]);

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      {buttonType === 'more' ? (
        <Button type="link" icon="more" size="small" />
      ) : (
        <Button type={buttonType} size="small" style={{ backgroundColor: '#ffffff' }}>
          Actions <Icon type="down" />
        </Button>
      )}
    </Dropdown>
  );
};

ReservationActionsDropdown.propTypes = {
  buttonType: PropTypes.string,
  reservation: PropTypes.object.isRequired,
  scheduleReservation: PropTypes.func.isRequired,
  teCoreAPI: PropTypes.object.isRequired,
};

ReservationActionsDropdown.defaultProps = {
  buttonType: 'default',
};

export default connect(null, mapActionsToProps)(withTECoreAPI(ReservationActionsDropdown));
