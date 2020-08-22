import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, Dropdown } from 'antd';

// COMPONENTS
import BaseReservationColQuickview from './BaseActivityColQuickview';

// CONSTANTS
import { activityActionLabels } from '../../../Constants/activityActions.constants';

const BaseReservationColDropdown = ({
  activityValue,
  activity,
  formatFn,
  mappingProps,
  disabled,
  availableActions,
  onActionClick,
}) => {
  const handleMenuClick = ({ key }) => onActionClick(key);

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
        {(availableActions || []).map(action => (
          <Menu.Item key={action}>{activityActionLabels[action]}</Menu.Item>
        ))}
      </Menu>
    );
  }, [activityValue, availableActions]);

  return (
    <Dropdown
      overlay={menuOptions}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
      disabled={disabled}
    >
      <Button size="small" type="link" icon="more" disabled={disabled} />
    </Dropdown>
  );
};

BaseReservationColDropdown.propTypes = {
  activityValue: PropTypes.object,
  mappingProps: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  formatFn: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  availableActions: PropTypes.array.isRequired,
  onActionClick: PropTypes.func.isRequired,
};

BaseReservationColDropdown.defaultProps = {
  disabled: false,
};

export default BaseReservationColDropdown;
