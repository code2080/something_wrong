import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, Dropdown } from 'antd';

// COMPONENTS
import BaseReservationColQuickview from './BaseActivityColQuickview';

// CONSTANTS
import { activityActions } from '../../Constants/activityActions.constants';
import { mappingTypes } from '../../Constants/mappingTypes.constants';
import { submissionValueTypes } from '../../Constants/submissionValueTypes.constants';
import { activityValueModes } from '../../Constants/activityValueModes.constants';

const BaseReservationColDropdown = ({
  activityValue,
  activity,
  formatFn,
  mappingProps,
  reservationActionFns
}) => {
  const handleMenuClick = useCallback(({ key }) => {
    if (reservationActionFns[key])
      reservationActionFns[key](activityValue);
  }, [reservationActionFns, activityValue]);

  const menuOptions = useMemo(() => {
    return (
      <Menu onClick={handleMenuClick}>
        <BaseReservationColQuickview
          activityValue={activityValue}
          mappingProps={mappingProps}
          activity={activity}
          formatFn={formatFn}
        />
        <Menu.Divider />
        {mappingProps.type === mappingTypes.OBJECT && (
          <Menu.Item key={activityActions.MANUAL_SELECT_OVERRIDE}>Manually select object</Menu.Item>
        )}
        {mappingProps.type === mappingTypes.FIELD && (
          <Menu.Item key={activityActions.MANUAL_INPUT_OVERRIDE}>Manually input value</Menu.Item>
        )}
        {mappingProps.type === mappingTypes.FIELD && activityValue.submissionValueType === submissionValueTypes.FILTER && (
          <Menu.Item key={activityActions.SELECT_BEST_FIT_VALUE}>Manually select best fit value</Menu.Item>
        )}
        {activityValue.valueMode === activityValueModes.MANUAL && (
          <Menu.Item key={activityActions.REVERT_TO_SUBMISSION_VALUE}>Revert to submission value</Menu.Item>
        )}
        <Menu.Item key={activityActions.SHOW_INFO}>Show details</Menu.Item>
      </Menu>
    );
  }, [activityValue, mappingProps]);

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
  activityValue: PropTypes.object,
  mappingProps: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  formatFn: PropTypes.func.isRequired,
  reservationActionFns: PropTypes.object.isRequired,
};

export default BaseReservationColDropdown;
