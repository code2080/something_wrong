import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Typography } from 'antd';

// ACTIONS
import { login, fetchOrgsForUser, selectOrgForUser, fetchProfile } from '../../Redux/Auth/auth.actions';
import { setBreadcrumbs } from '../../Redux/GlobalUI/globalUI.actions';

// COMPONENTS
import SignIn from './SignIn';
import SelectOrg from './SelectOrg';

// STYLES
import './Login.scss';

// CONSTANTS
import { authenticationStatuses } from '../../Constants/auth.constants';

const mapStateToProps = state => ({
  authenticationStatus: state.auth.authenticationStatus,
  userStatus: state.auth.user && state.auth.user.id && state.auth.user.organizationId,
});

const mapActionsToProps = {
  login,
  fetchOrgsForUser,
  selectOrgForUser,
  setBreadcrumbs,
  fetchProfile,
};

const LoginPage = ({
  login,
  fetchOrgsForUser,
  selectOrgForUser,
  authenticationStatus,
  userStatus,
  setBreadcrumbs,
  fetchProfile,
  history,
}) => {
  useEffect(() => {
    setBreadcrumbs([
      { path: '/', label: 'Login' }
    ]);
  }, [])

  useEffect(() => {
    if (authenticationStatus === authenticationStatuses.AUTHENTICATED && userStatus == null)
      fetchProfile();
    if (authenticationStatus === authenticationStatuses.AUTHENTICATED && userStatus != null)
      history.push('/forms');
    if (authenticationStatus === authenticationStatuses.MULTIPLE_ORGS) fetchOrgsForUser();
  }, [authenticationStatus, userStatus]);

  const handleLogin = useCallback(({ account, password }) => {
    login({ account, password });
  }, [login]);

  const handleSelectOrg = useCallback(organizationId => {
    selectOrgForUser({ organizationId });
  }, [selectOrgForUser]);

  return (
    <div className="login--wrapper">
      <Typography.Title level={2}>Sign in.</Typography.Title>
      <Typography.Paragraph>Sign in with your TE Preferences credentials to get started.</Typography.Paragraph>
      {authenticationStatus === authenticationStatuses.NOT_AUTHENTICATED && (
        <SignIn onSignIn={handleLogin} />
      )}
      {authenticationStatus === authenticationStatuses.MULTIPLE_ORGS && (
        <SelectOrg onSelectOrg={handleSelectOrg} />
      )}
    </div>
  );
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
  fetchOrgsForUser: PropTypes.func.isRequired,
  selectOrgForUser: PropTypes.func.isRequired,
  setBreadcrumbs: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  authenticationStatus: PropTypes.string,
  userStatus: PropTypes.string,
  history: PropTypes.object.isRequired,
};

LoginPage.defaultProps = {
  authenticationStatus: authenticationStatuses.NOT_AUTHENTICATED,
  userStatus: null,
};

export default withRouter(connect(
  mapStateToProps,
  mapActionsToProps
)(LoginPage));
