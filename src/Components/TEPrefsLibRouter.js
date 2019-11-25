import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Button } from 'antd';
import { deleteToken } from '../Utils/tokenHelpers';

// PAGES
import LoginPage from '../Pages/Login';
import FormListPage from '../Pages/FormList';
import FormPage from '../Pages/Form';
import FormInstancePage from '../Pages/FormInstance';

// COMPONENTS
import BreadcrumbsWrapper from './Breadcrumbs';

// CONSTANTS
const mapStateToProps = state => ({
  authenticated: state.auth.isLoggedIn,
});

const TEPrefsLibRouter = ({ authenticated }) => {
  const logoutButton = authenticated ? (<Button size="small" onClick={
    async () => {
      window.tePrefsLibStore.dispatch({ type: 'LOGIN_FAILURE' });
      await deleteToken();
      window.location = './login';
    }}>
    Log out
  </Button>) : null;
  return (
    <Router>
      <BreadcrumbsWrapper />
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/forms" component={FormListPage} />
        <Route exact path="/forms/:formId" component={FormPage} />
        <Route exact path="/forms/:formId/:formInstanceId" component={FormInstancePage} />
      </Switch>
      {logoutButton}
    </Router>
  );
};

TEPrefsLibRouter.propTypes = {
  authenticated: PropTypes.bool,
};

TEPrefsLibRouter.defaultProps = {
  authenticated: false,
};

export default connect(mapStateToProps, null)(TEPrefsLibRouter);
