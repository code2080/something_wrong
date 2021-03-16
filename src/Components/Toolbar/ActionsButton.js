import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const actionKeys = {
  LOGOUT: 'LOGOUT',
};

const ActionsButton = ({
  handleClick,
  isAuthenticated,
}) => {
  const menu = (
    <Menu onClick={handleClick}>
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
      <MenuOutlined />
    </Dropdown>
  );
};

ActionsButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

ActionsButton.defaultProps = {
  isAuthenticated: false,
  breadcrumbs: [],
  form: null,
};

export default ActionsButton;
