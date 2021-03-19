import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';

// ACTIONS
import { logout } from '../../Redux/Auth/auth.actions';

// STYLES
import './LogoutButton.scss';

// CONSTANTS
import { authenticationStatuses } from '../../Constants/auth.constants';
const mapStateToProps = (state) => ({
  isAuthenticated:
    state.auth.authenticationStatus === authenticationStatuses.AUTHENTICATED,
});

const mapActionsToProps = {
  logout,
};

const LogoutButton = ({ isAuthenticated, logout, history }) => {
  const logOutCallback = useCallback(async () => {
    await logout();
    history.push('/');
  }, [logout, history]);

  return (
    <Button
      size='small'
      type='link'
      onClick={logOutCallback}
      disabled={!isAuthenticated}
      className='logout--button'
    >
      Log out
    </Button>
  );
};

LogoutButton.propTypes = {
  isAuthenticated: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

LogoutButton.defaultProps = {
  isAuthenticated: false,
};

export default withRouter(
  connect(mapStateToProps, mapActionsToProps)(LogoutButton),
);
