import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon, Menu } from 'antd';

// CONSTANTS
import { formStatus } from '../../Constants/formStatuses.constants';

// HELPERS
import {hasAssistedSchedulingPermissions} from '../../Utils/permissionHelpers'

const actionKeys = {
  LOGOUT: 'LOGOUT',
  ACTIVITY_DESIGNER: 'ACTIVITY_DESIGNER',
};
const hasSelectedForm = breadcrumbs => breadcrumbs && breadcrumbs.length > 1;

const ActionsButton = ({
  handleClick,
  isAuthenticated,
  breadcrumbs,
  form,
}) => {
  const menu = (
    <Menu onClick={handleClick}>
      {hasSelectedForm(breadcrumbs) && hasAssistedSchedulingPermissions() && (
        <Menu.Item
          key={actionKeys.ACTIVITY_DESIGNER}
          disabled={!form || form.status !== formStatus.ACTIVE}
        >
          Activity Designer
        </Menu.Item>
      )}
      {hasSelectedForm(breadcrumbs) && hasAssistedSchedulingPermissions() && (
        <Menu.Divider />
      )}
      <Menu.Item
        key={actionKeys.LOGOUT}
        disabled={!isAuthenticated}
      >
        Log out
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      getPopupContainer={() => document.getElementById('te-prefs-lib')}
    >
      <Icon type="menu" />
    </Dropdown>
  );
};

ActionsButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  breadcrumbs: PropTypes.array,
  form: PropTypes.object,
};

ActionsButton.defaultProps = {
  isAuthenticated: false,
  breadcrumbs: [],
  form: null,
};

export default ActionsButton;
