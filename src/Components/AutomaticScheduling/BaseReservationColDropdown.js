import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, Dropdown } from 'antd';

// COMPONENTS
import BaseReservationColQuickview from './BaseReservationColQuickview';

// CONSTANTS
import { reservationActions } from '../../Constants/reservationActions.constants';
import { mappingTypes } from '../../Constants/mappingTypes.constants';
import { submissionValueTypes } from '../../Constants/submissionValueTypes.constants';
import { reservationValueModes } from '../../Constants/reservationValueModes.constants';

const BaseReservationColDropdown = ({
  reservationValue,
  reservation,
  formatFn,
  mappingProps,
  reservationActionFns
}) => {
  const handleMenuClick = useCallback(({ key }) => {
    if (reservationActionFns[key])
      reservationActionFns[key](reservationValue);
  }, [reservationActionFns, reservationValue]);

  const menuOptions = useMemo(() => {
    return (
      <Menu onClick={handleMenuClick}>
        <BaseReservationColQuickview
          reservationValue={reservationValue}
          mappingProps={mappingProps}
          reservation={reservation}
          formatFn={formatFn}
        />
        <Menu.Divider />
        {mappingProps.type === mappingTypes.OBJECT && (
          <Menu.Item key={reservationActions.MANUAL_SELECT_OVERRIDE}>Manually select object</Menu.Item>
        )}
        {mappingProps.type === mappingTypes.FIELD && (
          <Menu.Item key={reservationActions.MANUAL_INPUT_OVERRIDE}>Manually input value</Menu.Item>
        )}
        {mappingProps.type === mappingTypes.FIELD && reservationValue.submissionValueType === submissionValueTypes.FILTER && (
          <Menu.Item key={reservationActions.SELECT_BEST_FIT_VALUE}>Manually select best fit value</Menu.Item>
        )}
        {reservationValue.valueMode === reservationValueModes.MANUAL && (
          <Menu.Item key={reservationActions.REVERT_TO_SUBMISSION_VALUE}>Revert to submission value</Menu.Item>
        )}
        <Menu.Item key={reservationActions.SHOW_INFO}>Show details</Menu.Item>
      </Menu>
    );
  }, [reservationValue, mappingProps]);

  return (
    <Dropdown
      overlay={menuOptions}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <Button type="link" icon="more" />
    </Dropdown>
  );
};

BaseReservationColDropdown.propTypes = {
  reservationValue: PropTypes.object,
  mappingProps: PropTypes.object.isRequired,
  reservation: PropTypes.object.isRequired,
  formatFn: PropTypes.func.isRequired,
  reservationActionFns: PropTypes.object.isRequired,
};

export default BaseReservationColDropdown;
