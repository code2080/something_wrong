import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown, Button, Icon, Menu } from 'antd';

// ACTIONS
import { logout } from '../../Redux/Auth/auth.actions';

// CONSTANTS
import { authenticationStatuses } from '../../Constants/auth.constants';
import { formStatus } from '../../Constants/formStatuses.constants';

const actionKeys = {
  LOGOUT: 'LOGOUT',
  ACTIVITY_DESIGNER: 'ACTIVITY_DESIGNER',
};

const hasSelectedForm = breadcrumbs => breadcrumbs && breadcrumbs.length > 1;
const getFormIdFromBreadcrumb = breadcrumbs => {
  try {
    const formBreadcrumb = breadcrumbs[1];
    const fragments = formBreadcrumb.path.split('/');
    return fragments[2];
  } catch (error) {
    return null;
  }
};

const mapStateToProps = state => {
  const breadcrumbs = state.globalUI.breadcrumbs;
  const formId = getFormIdFromBreadcrumb(breadcrumbs);
  return {
    form: formId ? state.forms[formId] : null,
    isAuthenticated: state.auth.authenticationStatus === authenticationStatuses.AUTHENTICATED,
    breadcrumbs,
  };
};

const mapActionsToProps = {
  logout,
};

const ActionsButton = ({
  isAuthenticated,
  breadcrumbs,
  form,
  logout,
  history,
}) => {
  const logOutCallback = async () => {
    await logout();
    history.push('/');
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case actionKeys.LOGOUT:
        logOutCallback();
        break;
      case actionKeys.ACTIVITY_DESIGNER:
        history.push(`/forms/${form._id}/mapping`);
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {hasSelectedForm(breadcrumbs) && (
        <Menu.Item
          key={actionKeys.ACTIVITY_DESIGNER}
          disabled={!form || form.status !== formStatus.ACTIVE}
        >
          Activity Designer
        </Menu.Item>
      )}
      {hasSelectedForm(breadcrumbs) && (
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
      <Button size="small" >
        <Icon type="menu" />
      </Button>
    </Dropdown>
  );
};

ActionsButton.propTypes = {
  isAuthenticated: PropTypes.bool,
  breadcrumbs: PropTypes.array,
  form: PropTypes.object,
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

ActionsButton.defaultProps = {
  isAuthenticated: false,
  breadcrumbs: [],
  form: null,
};

export default withRouter(connect(mapStateToProps, mapActionsToProps)(ActionsButton));
