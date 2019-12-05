/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// CONSTANTS
import { authenticationStatuses } from '../../Constants/auth.constants';

const mapStateToProps = state => ({
  authenticationStatus: state.auth.authenticationStatus,
});

const AuthenticatedRoutes = ({ authenticationStatus, children }) => {
  return (
    <Route
      render={() => {
        if (authenticationStatus === authenticationStatuses.NOT_AUTHENTICATED)
          return <Redirect to={{ pathname: '/' }} />;
        return children;
      }}
    />
  );
};

AuthenticatedRoutes.propTypes = {
  authenticationStatus: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
};

AuthenticatedRoutes.defaultProps = {
  authenticationStatus: authenticationStatuses.NOT_AUTHENTICATED,
  children: null,
};

export default withRouter(connect(
  mapStateToProps,
  null
)(AuthenticatedRoutes));
